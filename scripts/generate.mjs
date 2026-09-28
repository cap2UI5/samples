#!/usr/bin/env node
// generate - the abap2UI5 samples as cap2UI5 apps, translated, not ported.
//
//   node scripts/generate.mjs [--check] [--samples <abap2UI5/samples checkout>]
//
// Every class scripts/samples.json lists under "generated" is read from an
// abap2UI5/samples checkout AT the commit ABAP2UI5_SAMPLES_PIN names and
// translated by cap2ui5's abap2js into srv/apps/<class>.js - the same class
// name, so ?app_start= is the same on both sides, and the original's lines,
// comments and texts. Nothing in those files is edited by hand: a change goes
// into the ABAP sample, the pin moves, and this runs again.
//
// The checkout is --samples, else $ABAP2UI5_SAMPLES, else ../abap2UI5-samples.
// It has to be at the pin, so that `@origin` in a module names the source the
// module really came from.
//
// --check writes nothing and exits 1 when a generated module is missing or
// differs from what the translation writes - the CI gate that keeps srv/apps
// and the pin in step. The HAND-WRITTEN ports (samples.json "handwritten") are
// never touched.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { abap2js, Abap2jsError } from "cap2ui5";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const at = args.indexOf("--samples");
const checkout = path.resolve(at >= 0 ? args[at + 1] : process.env.ABAP2UI5_SAMPLES ?? path.join(ROOT, "..", "abap2UI5-samples"));

const pin = fs.readFileSync(path.join(ROOT, "ABAP2UI5_SAMPLES_PIN"), "utf8").trim();
const { generated, handwritten } = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "samples.json"), "utf8"));
const src = path.join(checkout, "src");

if (!fs.existsSync(src)) {
  console.error(`generate: no abap2UI5/samples checkout at ${checkout} - clone it and check out ${pin}:\n` +
    `  git clone https://github.com/abap2UI5/samples ${checkout} && git -C ${checkout} checkout ${pin}`);
  process.exit(1);
}
let head = "";
try { head = execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(); } catch { /* no git */ }
if (head !== pin) {
  console.error(`generate: ${checkout} is at ${head || "an unknown commit"}, ABAP2UI5_SAMPLES_PIN says ${pin}`);
  process.exit(1);
}
const overlap = generated.filter((n) => n in handwritten);
if (overlap.length) {
  console.error(`generate: ${overlap.join(", ")} listed as generated AND handwritten in scripts/samples.json`);
  process.exit(1);
}

let failed = 0;
let changed = 0;
for (const name of generated) {
  const file = path.join(src, `${name}.clas.abap`);
  let code;
  try {
    ({ code } = abap2js(fs.readFileSync(file, "utf8"), {
      file, lib: [src], origin: `abap2UI5/samples src/${name}.clas.abap`, format: "esm",
    }));
  } catch (e) {
    if (!(e instanceof Abap2jsError)) throw e;
    console.error(`refused: ${e.message}`);
    failed++;
    continue;
  }
  const target = path.join(ROOT, "srv", "apps", `${name}.js`);
  const before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
  if (before === code) continue;
  changed++;
  if (check) console.error(`${before === null ? "missing" : "differs"}: srv/apps/${name}.js`);
  else fs.writeFileSync(target, code);
}

console.log(`generate: ${generated.length} samples from abap2UI5/samples@${pin.slice(0, 7)}, ` +
  `${changed} ${check ? "to regenerate" : "written"}, ${failed} refused`);
process.exit(failed || (check && changed) ? 1 : 0);
