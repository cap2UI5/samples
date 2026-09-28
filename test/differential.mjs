// The differential test: every sample beside its ABAP original, in one server.
//
//   npm run differential      (scripts/originals.mjs first - see there)
//
// The original is abap2UI5's class, transpiled and renamed ZABAP_SMP_APP_nnn
// (test/.originals/); the sample is srv/apps/z2ui5_cl_smp_app_nnn.js, as
// abap2js translated it or a person ported it. Both are started, and then
// every event the original's first view wires is fired on a fresh start of
// each - and what comes back is compared: the XML of every view slot, the
// model the original sends, every other action, and which app has the screen.
// "Line for line" is a claim about the source; this is the one about what the
// source DOES, and it is the gate a sample passes before it is listed in
// scripts/samples.json.
//
// Two differences are expected, and neither is the sample's:
// - the translation's model carries fields the original's does not send: a
//   cap2UI5 app's every field is part of its model (the plugin's README), so
//   only the fields the ORIGINAL sends are compared.
// - KNOWN below: what JavaScript does differently on purpose, per sample.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { actions, post, ROOT, serve } from "./server.mjs";

const s = serve();
const ORIGINALS = path.join(ROOT, "test", ".originals");
const { generated, handwritten } = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "samples.json"), "utf8"));
const SAMPLES = [...generated, ...Object.keys(handwritten)].sort().map((n) => n.toUpperCase());

// CONV string( ) of a number: ABAP keeps a sign position ("0 "), String( ) does not
const KNOWN = { Z2UI5_CL_SMP_APP_122: ["DEVICE_HEIGHT", "DEVICE_WIDTH"] };

/** The originals, registered into the running runtime as a transpiled class
 *  registers itself - after the plugin has booted it, which the first
 *  roundtrip does. */
async function loadOriginals() {
  assert.ok(fs.existsSync(ORIGINALS), "no test/.originals - run node scripts/originals.mjs first");
  await post(s.url, { app: SAMPLES[0] });
  for (const f of fs.readdirSync(ORIGINALS).filter((x) => x.endsWith(".clas.mjs"))) {
    await import(pathToFileURL(path.join(ORIGINALS, f)).href);
  }
}

// the two sides' names, and the draft ids every roundtrip draws anew
const norm = (x) => String(x ?? "").replace(/ZABAP_SMP_APP_/g, "Z2UI5_CL_SMP_APP_")
  .replace(/zabap_smp_app_/g, "z2ui5_cl_smp_app_").replace(/[0-9A-F]{32}/g, "<ID>");
const views = (r) => actions(r).filter((a) => a[0] === "VIEW_SLOTS").map((a) => norm(JSON.stringify(a)));
const others = (r) => norm(JSON.stringify(actions(r).filter((a) => a[0] !== "VIEW_SLOTS")));
/** the events a response's views wire: .eB(['NAME', …]) with their literal arguments */
const wired = (r) => {
  const out = new Map();
  for (const v of actions(r).filter((a) => a[0] === "VIEW_SLOTS")) {
    for (const m of String(v[3] ?? "").matchAll(/\.eB\(\[([^\]]*)\]/g)) {
      const [name, ...rest] = m[1].split(",").map((x) => x.trim());
      const event = name?.replace(/^'|'$/g, "");
      if (event && !out.has(event)) out.set(event, rest.map((x) => (/^'.*'$/.test(x) ? x.slice(1, -1) : "x")));
    }
  }
  return out;
};

function differences(app, label, a, j) {
  const found = [];
  if (a.status !== j.status) found.push(`HTTP ${a.status} vs ${j.status}`);
  if (JSON.stringify(views(a)) !== JSON.stringify(views(j))) {
    const la = views(a).join("\n").split(/(?=<)/);
    const lj = views(j).join("\n").split(/(?=<)/);
    const i = la.findIndex((x, k) => x !== lj[k]);
    found.push(`view: ${la[i]?.slice(0, 200)}  ≠  ${lj[i]?.slice(0, 200)}`);
  }
  const ma = a.json?.MODEL ?? {};
  const mj = j.json?.MODEL ?? {};
  for (const k of Object.keys(ma)) {
    if ((KNOWN[app] ?? []).includes(k)) continue;
    if (norm(JSON.stringify(ma[k])) !== norm(JSON.stringify(mj[k]))) found.push(`model ${k}: ${JSON.stringify(ma[k])} ≠ ${JSON.stringify(mj[k])}`);
  }
  if (others(a) !== others(j)) found.push(`actions: ${others(a).slice(0, 200)}  ≠  ${others(j).slice(0, 200)}`);
  if (norm(a.app) !== norm(j.app)) found.push(`app: ${a.app} ≠ ${j.app}`);
  return found.map((f) => `${app} ${label}: ${f}`);
}

test("every sample does what its ABAP original does, roundtrip for roundtrip", { timeout: 1_800_000 }, async (t) => {
  await loadOriginals();
  const P = (o) => post(s.url, o);
  const found = [];
  let roundtrips = 0;
  for (const app of SAMPLES) {
    const original = app.replace("Z2UI5_CL_SMP_APP_", "ZABAP_SMP_APP_");
    const a = await P({ app: original });
    const j = await P({ app });
    found.push(...differences(app, "start", a, j));
    roundtrips++;
    for (const [event, args] of wired(a)) {
      const a0 = await P({ app: original });
      const j0 = await P({ app });
      const a1 = await P({ app: a0.app, id: a0.id, event, args });
      const j1 = await P({ app: j0.app, id: j0.id, event, args });
      found.push(...differences(app, `event ${event}`, a1, j1));
      roundtrips++;
    }
  }
  assert.deepEqual(found, [], `${found.length} difference(s) in ${roundtrips} roundtrips`);
  t.diagnostic(`${SAMPLES.length} samples, ${roundtrips} roundtrips, no difference`);
});
