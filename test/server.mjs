// The samples project served in this process by cds.test, and the abap2UI5
// wire to talk to it: the tests play the frontend's part, one POST per
// roundtrip, the way cap2UI5's own suite does (examples/bookshop/test).
import cds from "@sap/cds";
import { XMLValidator } from "fast-xml-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Serve the project for the calling test file (cds.test registers the hooks). */
export function serve() {
  const t = cds.test(ROOT);
  return { get url() { return `${t.url}/rest/root/z2ui5`; } };
}

/**
 * One roundtrip. No `id` starts `app`; with `id` it answers an event on the
 * draft the previous response named. `model` is what the frontend sends back:
 * the bound values the user changed.
 */
export async function post(url, { app, id = "", event = "", args = [], model = {} } = {}) {
  const body = { value: { S_FRONT: {
    ID: id, APP: app, EVENT: event, T_EVENT_ARG: args,
    ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5",
    SEARCH: id ? "" : `?app_start=${app}`, HASH: "", CONFIG: {} },
    XX: {}, MODEL: model } };
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from("alice:").toString("base64"),   // CAP's mocked user
    },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* an error page, not a wire envelope */ }
  return { status: r.status, text, json, id: json?.S_FRONT?.ID, app: json?.S_FRONT?.APP };
}

/** Every action of a response, system and custom. */
export const actions = (r) => [
  ...(r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? []),
  ...(r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? []),
];

/** The XML a response displays into a view slot (MAIN, POPUP, NEST, …), or undefined. */
export const slot = (r, name) => actions(r)
  .find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === name)?.[3];

export const destroys = (r, name) => actions(r)
  .some((a) => a[0] === "VIEW_SLOTS" && a[1] === "destroy" && a[2] === name);

/** true, or the parser's complaint - a template literal typo shows up here, not only in the browser */
export const wellFormed = (xml) => {
  const v = XMLValidator.validate(xml);
  return v === true ? true : `${v.err.code} at ${v.err.line}:${v.err.col} - ${v.err.msg}`;
};
