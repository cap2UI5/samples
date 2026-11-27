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

// What a response says, as protocol 3 carries it (abap2UI5/protocol): the
// screen in S_FRONT.VIEWS - one entry per slot the roundtrip changes,
// { XML, OPT } to display it or { DESTROY: true } to take it down - the URL
// intent in S_FRONT.NAV and what to do on the screen in S_FRONT.ACTIONS.

/** The slots a response changes: { MAIN: { XML, OPT }, POPUP: { DESTROY: true }, … }. */
export const views = (r) => r.json?.S_FRONT?.VIEWS ?? {};

/** The front-end actions of a response, in order. */
export const actions = (r) => r.json?.S_FRONT?.ACTIONS ?? [];

/** The XML a response displays into a view slot (MAIN, POPUP, NEST, …), or undefined. */
export const slot = (r, name) => views(r)[name]?.XML;

export const destroys = (r, name) => views(r)[name]?.DESTROY === true;

/** true, or the parser's complaint - a template literal typo shows up here, not only in the browser */
export const wellFormed = (xml) => {
  const v = XMLValidator.validate(xml);
  return v === true ? true : `${v.err.code} at ${v.err.line}:${v.err.col} - ${v.err.msg}`;
};
