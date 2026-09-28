// Every sample, driven over the wire against the published cap2ui5 package:
// it starts, its view is well-formed XML, and its events do what the sample
// says they do - including the navigation round trips between two apps.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { actions, destroys, post, ROOT, serve, slot, wellFormed } from "./server.mjs";

const s = serve();
const P = (o) => post(s.url, o);
const ok = (r) => assert.equal(r.status, 200, r.text.slice(0, 500));

const APPS = fs.readdirSync(path.join(ROOT, "srv/apps"))
  .filter((f) => /^z2ui5_cl_smp_app_\d+\.js$/.test(f))
  .map((f) => f.replace(/\.js$/, "").toUpperCase());

test("every sample starts, and its view is well-formed XML titled cap2UI5", async () => {
  assert.ok(APPS.length > 0);
  for (const app of APPS) {
    const r = await P({ app });
    ok(r);
    const xml = slot(r, "MAIN");
    assert.ok(xml, `${app}: no MAIN view on the start`);
    assert.equal(wellFormed(xml), true, `${app}: ${wellFormed(xml)}`);
    assert.match(xml, /title="cap2UI5 - /, `${app}: the page title`);
    assert.match(xml, /showNavButton="false"/, `${app}: started directly, there is nothing to go back to`);
  }
});

test("493 Hello World: one view, no state", async () => {
  const r = await P({ app: "Z2UI5_CL_SMP_APP_493" });
  ok(r);
  assert.match(slot(r, "MAIN"), /<Title text="Hello World"/);
  assert.equal(r.json.MODEL, undefined, "an app without fields sends no model");
});

test("494 Data Binding: the typed name reaches the backend, the greeting comes back", async () => {
  const start = await P({ app: "Z2UI5_CL_SMP_APP_494" });
  assert.deepEqual(start.json.MODEL, { NAME: "World", GREETING: "" });
  assert.match(slot(start, "MAIN"), /<Input value="\{\/NAME\}"\/>/);

  const greet = await P({ app: "Z2UI5_CL_SMP_APP_494", id: start.id, event: "GREET", model: { NAME: "Ada" } });
  ok(greet);
  assert.deepEqual(greet.json.MODEL, { NAME: "Ada", GREETING: "Hello Ada!" });
  assert.deepEqual(actions(greet)[0].slice(0, 3),
    ["MESSAGE_BOX", "show", "Roundtrip done: the backend read NAME = 'Ada' and wrote GREETING back into the view."]);
});

test("495 Lifecycle: first run, event, and the return from a called app", async () => {
  const APP = "Z2UI5_CL_SMP_APP_495";
  const start = await P({ app: APP });
  assert.deepEqual(start.json.MODEL.T_LOG.map((r) => r.NO), ["1"]);

  const log = await P({ app: APP, id: start.id, event: "LOG" });
  assert.equal(slot(log, "MAIN"), undefined, "an event does not rebuild the view");
  assert.equal(log.json.MODEL.T_LOG.length, 2, "only the model is pushed");

  const call = await P({ app: APP, id: log.id, event: "CALL" });
  assert.equal(call.app, "Z2UI5_CL_SMP_APP_493", "c.navTo( ) hands the screen to Basics I");
  assert.match(slot(call, "MAIN"), /Basics I - Hello World/);
  assert.match(slot(call, "MAIN"), /showNavButton="true"/, "the called app can go back");

  const back = await P({ app: call.app, id: call.id, event: "BACK" });
  assert.equal(back.app, APP, "c.navBack( ) returns to the caller");
  assert.match(slot(back, "MAIN") ?? "", /Basics III/, "the caller renders again (c.isDisplay)");
  assert.deepEqual(back.json.MODEL.T_LOG.map((r) => r.CHECK.split(" - ")[0]),
    ["c.isFirstRun", "c.eventName", "c.eventName", "c.isDisplay"],
    "the log survived the navigation, and the return is c.isDisplay without c.isFirstRun");
});

test("011 Editable Table: edit mode, delete the selected rows, add a row", async () => {
  const APP = "Z2UI5_CL_SMP_APP_011";
  const start = await P({ app: APP });
  const rows = start.json.MODEL.T_TAB;
  assert.equal(rows.length, 6);
  assert.deepEqual(rows[0], { SELKZ: false, TITLE: "entry 01", VALUE: "red", DESCR: "this is a description",
    ICON: "", INFO: "completed", EDITABLE: false, CHECKBOX: true });

  const edit = await P({ app: APP, id: start.id, event: "BUTTON_EDIT" });
  assert.ok(edit.json.MODEL.T_TAB.every((r) => r.EDITABLE), "every row is editable");

  // the user selects rows 2 and 4 - the frontend sends the table back
  const selected = edit.json.MODEL.T_TAB.map((r, i) => ({ ...r, SELKZ: i === 1 || i === 3 }));
  const del = await P({ app: APP, id: edit.id, event: "BUTTON_DELETE", model: { T_TAB: selected } });
  ok(del);
  assert.deepEqual(del.json.MODEL.T_TAB.map((r) => r.TITLE), ["entry 01", "entry 03", "entry 05", ""]);

  const add = await P({ app: APP, id: del.id, event: "BUTTON_ADD" });
  assert.equal(add.json.MODEL.T_TAB.length, 5);
  assert.equal(add.json.MODEL.T_TAB.at(-1).EDITABLE, true, "a new row follows the edit mode");
});

test("167 Event Arguments: fixed values and client-side expressions travel with the event", async () => {
  const APP = "Z2UI5_CL_SMP_APP_167";
  const start = await P({ app: APP });
  // > is legal in an attribute; whether it arrives escaped depends on the cap2ui5 release
  const press = slot(start, "MAIN").replaceAll("&gt;", ">").match(/(press|submit)="[^"]*"/g);
  assert.deepEqual(press, [
    `press=".eB(['EVENT_FIX_VAL'], 'FIX_VAL')"`,
    `press=".eB(['EVENT_MODEL_VALUE'], \${/MV_VALUE})"`,
    `press=".eB(['SOURCE_PROPERTY_TEXT'], \${$source>/text})"`,
    `submit=".eB(['EVENT_PROPERTY_VALUE'], \${$parameters>/value})"`,
    `press=".eB(['PARENT_PROPERTY_ID'], $event.oSource.oParent.sId)"`,
  ]);

  const fix = await P({ app: APP, id: start.id, event: "EVENT_FIX_VAL", args: ["FIX_VAL"] });
  assert.deepEqual(actions(fix)[0].slice(0, 3), ["MESSAGE_BOX", "show", "backend event: FIX_VAL"]);
});

test("161 Dialog inside a Dialog: open, chain to the second, back to the first, close", async () => {
  const APP = "Z2UI5_CL_SMP_APP_161";
  const start = await P({ app: APP });

  const open = await P({ app: APP, id: start.id, event: "POPUP" });
  assert.match(slot(open, "POPUP") ?? "", /Open 2nd popup/);
  assert.equal(wellFormed(slot(open, "POPUP")), true);

  const second = await P({ app: APP, id: open.id, event: "GOTO_2ND" });
  assert.match(slot(second, "POPUP") ?? "", /this is a second popup/);

  const first = await P({ app: APP, id: second.id, event: "BTN_OK_2ND" });
  assert.match(slot(first, "POPUP") ?? "", /Open 2nd popup/, "closing the second shows the first again");

  const close = await P({ app: APP, id: first.id, event: "BTN_OK_1ND" });
  assert.ok(destroys(close, "POPUP"), "the popup is closed");
});

test("488/489 Navigation: the called app returns an event, the caller reads its data", async () => {
  const start = await P({ app: "Z2UI5_CL_SMP_APP_488" });
  assert.deepEqual(start.json.MODEL, { S_RESULT: { PRODUCT: "", QUANTITY: "" }, RETURNED_EVENT: "" });

  const called = await P({ app: "Z2UI5_CL_SMP_APP_488", id: start.id, event: "CALL_APP" });
  assert.equal(called.app, "Z2UI5_CL_SMP_APP_489");
  assert.deepEqual(called.json.MODEL, { S_RESULT: { PRODUCT: "Notebook Basic 15", QUANTITY: "2" } });

  // the user edits both fields - bound relatively inside binding="{/S_RESULT}"
  const confirm = await P({ app: called.app, id: called.id, event: "CONFIRM",
    model: { S_RESULT: { PRODUCT: "Notebook Pro 17", QUANTITY: "7" } } });
  assert.equal(confirm.app, "Z2UI5_CL_SMP_APP_488");
  assert.deepEqual(confirm.json.MODEL,
    { S_RESULT: { PRODUCT: "Notebook Pro 17", QUANTITY: "7" }, RETURNED_EVENT: "DATA_CONFIRMED" });
  assert.match(slot(confirm, "MAIN") ?? "", /Result returned by the called app/, "the caller renders again");

  const again = await P({ app: "Z2UI5_CL_SMP_APP_488", id: confirm.id, event: "CALL_APP" });
  const cancel = await P({ app: again.app, id: again.id, event: "CANCEL" });
  assert.deepEqual(cancel.json.MODEL,
    { S_RESULT: { PRODUCT: "", QUANTITY: "" }, RETURNED_EVENT: "DATA_CANCELLED" });
});

test("125 Tab Title: the front-end action goes out through c.raw", async () => {
  const APP = "Z2UI5_CL_SMP_APP_125";
  const start = await P({ app: APP });
  const set = await P({ app: APP, id: start.id, event: "SET_TITLE", model: { TITLE: "Invoices" } });
  ok(set);
  assert.deepEqual(actions(set), [["SET_TITLE", "Invoices"]]);
});
