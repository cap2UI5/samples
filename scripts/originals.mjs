#!/usr/bin/env node
// originals - the ABAP originals of this repository's samples, transpiled, for
// the differential test (test/differential.mjs).
//
//   node scripts/originals.mjs [--samples <abap2UI5/samples checkout>]
//
// Every class scripts/samples.json names is copied from the checkout at the
// pin, renamed Z2UI5_CL_SMP_APP_nnn -> ZABAP_SMP_APP_nnn so that original and
// translation can be served side by side, and transpiled by
// @abaplint/transpiler - the version @abap2ui5/node-runtime was built with,
// against the ABAP that package ships in downport/ - into test/.originals/.
// The runtime's own transpiler output is what cap2UI5 hosts, so the original
// runs on exactly the framework the translation runs on.
//
// Needs the network once: open-abap-core is cloned into .deps/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const at = args.indexOf("--samples");
const checkout = path.resolve(at >= 0 ? args[at + 1] : process.env.ABAP2UI5_SAMPLES ?? path.join(ROOT, "..", "abap2UI5-samples"));
const pin = fs.readFileSync(path.join(ROOT, "ABAP2UI5_SAMPLES_PIN"), "utf8").trim();
const { generated, handwritten } = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "samples.json"), "utf8"));
const names = [...generated, ...Object.keys(handwritten)];

const head = execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (head !== pin) throw new Error(`${checkout} is at ${head}, ABAP2UI5_SAMPLES_PIN says ${pin}`);

// the transpiler the runtime was built with: its output is tied to the runtime
const runtimeDir = path.dirname(require.resolve("@abap2ui5/node-runtime/package.json", { paths: [require.resolve("@cap2ui5/cds-plugin")] }));
const wanted = JSON.parse(fs.readFileSync(path.join(runtimeDir, "package.json"), "utf8")).abap2ui5?.transpiler;
const have = JSON.parse(fs.readFileSync(require.resolve("@abaplint/transpiler-cli/package.json"), "utf8")).version;
if (wanted && wanted !== have) {
  throw new Error(`@abaplint/transpiler-cli ${have} is installed, @abap2ui5/node-runtime was built with ${wanted} - ` +
    `npm i -D --save-exact @abaplint/transpiler-cli@${wanted}`);
}

const deps = path.join(ROOT, ".deps", "open-abap-core");
if (!fs.existsSync(deps)) {
  execFileSync("git", ["clone", "--depth", "1", "https://github.com/open-abap/open-abap-core", deps], { stdio: "inherit" });
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "originals-"));
try {
  const input = path.join(work, "abap");
  fs.mkdirSync(input);
  const rename = (s) => s.replace(/z2ui5_cl_smp_app_(\d{3})/g, "zabap_smp_app_$1").replace(/Z2UI5_CL_SMP_APP_(\d{3})/g, "ZABAP_SMP_APP_$1");
  for (const name of names) {
    for (const ext of ["clas.abap", "clas.xml"]) {
      const file = path.join(checkout, "src", `${name}.${ext}`);
      if (fs.existsSync(file)) fs.writeFileSync(path.join(input, `${rename(name)}.${ext}`), rename(fs.readFileSync(file, "utf8")));
    }
  }
  // the transpiler reads a lib folder relative to where it runs
  fs.symlinkSync(path.join(runtimeDir, "downport"), path.join(work, "downport"));
  fs.symlinkSync(deps, path.join(work, "open-abap-core"));
  fs.writeFileSync(path.join(work, "abap_transpile.json"), JSON.stringify({
    input_folder: "abap",
    output_folder: "output",
    libs: [
      { folder: "/downport", files: "/**/*.*" },
      { folder: "/open-abap-core" },
    ],
    write_unit_tests: false,
    options: { ignoreSyntaxCheck: false, addFilenames: true, unknownTypes: "runtimeError" },
  }, null, 2));
  execFileSync(process.execPath, [require.resolve("@abaplint/transpiler-cli/abap_transpile"), "abap_transpile.json"],
    { cwd: work, stdio: ["ignore", "ignore", "inherit"] });
  const out = path.join(ROOT, "test", ".originals");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (const name of names) {
    const file = path.join(work, "output", `${rename(name)}.clas.mjs`);
    if (!fs.existsSync(file)) throw new Error(`the transpiler wrote no ${rename(name)}.clas.mjs`);
    fs.copyFileSync(file, path.join(out, path.basename(file)));
    n++;
  }
  console.log(`originals: ${n} classes from abap2UI5/samples@${pin.slice(0, 7)} transpiled into test/.originals/`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
