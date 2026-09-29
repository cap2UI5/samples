#!/usr/bin/env node
/**
 * consumer-test - the samples the way a project gets them:
 * `npm add @cap2ui5/samples`.
 *
 * Everything else here runs the samples as THIS project's apps - srv/apps
 * under its own root. That proves the samples work; it proves nothing about
 * the PACKAGE. A `files` list that forgets srv/apps, a `cap2ui5.apps` naming
 * the wrong directory, an import that only resolves inside this checkout -
 * none of those can fail here, and all of them fail in the project that adds
 * the package.
 *
 * So this packs the samples as `npm publish` would, installs the tarball
 * into a throwaway CAP project that has an app of its own and the plugin,
 * serves it, and checks that
 *
 *   - the tarball carries every sample, and nothing of the tests or scripts
 *   - the plugin loads the samples from the installed package, beside the
 *     project's own app
 *   - a sample starts and shows its view, and the project's app still answers
 *
 * The plugin comes from npm, in the version the samples' peerDependencies
 * name - or, with --plugin <tarball>, from a packed plugin, before that
 * version is published.
 *
 * Usage:  node scripts/consumer-test.mjs [--plugin <cap2ui5-cds-plugin-x.y.z.tgz>] [--keep]
 */
import { execFileSync, spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const KEEP = args.includes("--keep");
const at = args.indexOf("--plugin");
const PLUGIN_TGZ = at >= 0 ? path.resolve(args[at + 1]) : null;
const run = (cmd, argv, cwd) => execFileSync(cmd, argv, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

// the ports fetch( ) refuses to connect to - the WHATWG "bad port" list,
// as cap2UI5's test server keeps it
const BAD_PORTS = new Set([5060, 5061, 6000, 6566, 6665, 6666, 6667, 6668, 6669, 6679, 6697]);
let PORT;
do PORT = 5000 + Math.floor(Math.random() * 2000); while (BAD_PORTS.has(PORT));

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${name}${detail ? `  ${detail}` : ""}`);
  if (!ok) failures++;
};

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const samples = fs.readdirSync(path.join(ROOT, pkg.cap2ui5.apps)).filter((f) => /\.(c|m)?js$/.test(f));

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cap2ui5-samples-consumer-"));
const proj = path.join(dir, "proj");
let server;
try {
  console.log(`consumer-test: ${dir}`);

  // --- pack, exactly as publish would -----------------------------------------
  const [packed] = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", dir], ROOT));
  const files = packed.files.map((f) => f.path);
  const apps = files.filter((f) => f.startsWith(`${pkg.cap2ui5.apps}/`));
  check("the tarball carries every sample", apps.length === samples.length, `${apps.length} of ${samples.length}`);
  for (const f of ["package.json", "README.md", "CHANGELOG.md", "LICENSE"]) {
    check(`the tarball carries ${f}`, files.includes(f));
  }
  const stray = files.filter((f) => /^(test|scripts|\.github)\//.test(f));
  check("the tarball carries no tests, scripts or workflows", stray.length === 0, stray.slice(0, 3).join(" "));

  // --- a CAP project that has never heard of this repository ------------------
  fs.mkdirSync(path.join(proj, "srv", "apps"), { recursive: true });
  fs.writeFileSync(path.join(proj, "package.json"), JSON.stringify({
    name: "cap2ui5-samples-consumer-probe",
    private: true,
    dependencies: {
      "@cap-js/sqlite": pkg.devDependencies["@cap-js/sqlite"],
      "@sap/cds": pkg.devDependencies["@sap/cds"],
    },
    cds: { requires: { db: { kind: "sqlite", credentials: { url: ":memory:" } } } },
  }, null, 2));
  fs.writeFileSync(path.join(proj, "srv", "apps", "probe.js"), `
const { defineApp } = require("@cap2ui5/cds-plugin");
defineApp("ZCL_PROBE", class {
  from = "the project";
  main(client) {
    if (client.check_on_navigated()) {
      client.view_display(\`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="\${client._bind("from")}"/></mvc:View>\`);
    }
  }
});
`);
  const plugin = PLUGIN_TGZ ?? `@cap2ui5/cds-plugin@${pkg.peerDependencies["@cap2ui5/cds-plugin"]}`;
  run("npm", ["install", "--no-audit", "--no-fund", plugin, path.join(dir, packed.filename)], proj);
  check("npm install of the samples and the plugin succeeds", true, PLUGIN_TGZ ? path.basename(PLUGIN_TGZ) : plugin);

  // --- served ------------------------------------------------------------------
  const serve = createRequire(path.join(proj, "package.json")).resolve("@sap/cds/bin/serve.js");
  server = spawn(process.execPath, [serve], {
    cwd: proj,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: "development" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let out = "";
  server.stdout.on("data", (d) => (out += d));
  server.stderr.on("data", (d) => (out += d));
  for (let i = 0; i < 90 && !out.includes("server listening") && server.exitCode === null; i++) await sleep(1000);
  check("the server starts with the samples installed", out.includes("server listening"),
    out.includes("server listening") ? "" : out.slice(-1500));

  const loaded = out.match(/(\d+) app module\(s\) loaded from @cap2ui5\/samples/);
  check("the plugin loads the samples from the installed package", Number(loaded?.[1]) === samples.length,
    loaded?.[0] ?? "no log line naming @cap2ui5/samples");
  check("and the project's own app beside them", /1 app module\(s\) loaded from srv\/apps/.test(out));

  const url = `http://127.0.0.1:${PORT}/rest/root/z2ui5`;
  const post = async (app) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from("alice:").toString("base64") },
      body: JSON.stringify({ value: { S_FRONT: {
        ID: "", APP: app, EVENT: "", T_EVENT_ARG: [], ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5",
        SEARCH: `?app_start=${app}`, HASH: "", CONFIG: {} }, XX: {}, MODEL: {} } }),
    });
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* an error page */ }
    return { status: r.status, text, json };
  };
  const view = (r) => (r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? [])
    .find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === "MAIN")?.[3] ?? "";

  const hello = await post("Z2UI5_CL_SMP_APP_493");
  check("a sample starts and shows its view", hello.status === 200 && /title="abap2UI5 - /.test(view(hello)),
    `${hello.status} ${hello.status === 200 ? "" : hello.text.slice(0, 200)}`);
  const own = await post("ZCL_PROBE");
  check("the project's own app still answers", own.status === 200 && own.json?.MODEL?.FROM === "the project",
    `${own.status} ${JSON.stringify(own.json?.MODEL ?? {})}`);
} catch (e) {
  check("the consumer test ran through", false, String(e.stderr || e.message).trim().split("\n").slice(0, 3).join(" | "));
} finally {
  if (server) try { process.kill(-server.pid, "SIGKILL"); } catch { /* already gone */ }
  if (KEEP) console.log(`kept: ${dir}`);
  else fs.rmSync(dir, { recursive: true, force: true });
}

console.log(failures ? `\nconsumer-test: ${failures} FAILED` : "\nconsumer-test: OK");
process.exit(failures ? 1 : 0);
