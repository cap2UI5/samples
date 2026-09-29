// @keywords localstorage sessionstorage persist store_data offline
// @summary Writes to the browser's local and session storage and reads it back, so a value survives a reload without any state in the backend.
// @docs https://abap2ui5.github.io/docs/cookbook/browser_interaction/clipboard
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_327.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

// Both fields are strings on purpose. The value round-trips through the
// browser and back through the storage, so whatever sits under the key is
// outside this app's control - and the framework converts it into these
// components BEFORE main( ) runs, where no TRY/CATCH of ours can reach it.
// A numeric component would let one oversized stored value (or a leftover
// from an earlier shape) fail the conversion on every single app start,
// leaving no screen from which to clear it.
const ty_s_value = {
  field1: "",
  field2: "",
};

const ty_s_storage = {
  type:   "",
  prefix: "",
  key:    "",
  value:  ty_s_value,
};

const ty_s_type = {
  type: "",
};

defineApp("Z2UI5_CL_SMP_APP_327", class {

  s_storage = ty_s_storage;
  s_stored_value = ty_s_value;
  t_types = t.table(ty_s_type);

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_init() {

    this.t_types   = [ { type: "local" }, { type: "session" } ];
    this.s_storage = { type:   "local",
                         prefix: "prefix1",
                         key:    "key1",
                         value:  { field1: "1",
                                           field2: "textfld1" } };

    this.view_display();

  }

  on_event() {
    let lv_json;

    switch (this.client.get_event()) {

      case "LOCAL_STORAGE_LOADED":
        // The z2ui5:Storage control read a value out of the browser storage
        // and reports it through its `finished` event. The payload is a whole
        // structure, so it arrives as JSON - here it is picked apart field by
        // field, which is also what keeps this tolerant: whatever sits under
        // the key may carry more (or other) fields than this app models - an
        // earlier shape, or a value someone else wrote. A field that is not
        // there simply stays empty.
        lv_json = this.client.get_event_arg(4);
        this.s_storage = { ...this.s_storage, value: { field1: this.json_get_value({ json: lv_json,
                                                            name: "FIELD1" }),
                                   field2: this.json_get_value({ json: lv_json,
                                                            name: "FIELD2" }) } };
        break;

      case "GET_STORED_VALUE":
        this.s_storage = { ...this.s_storage, value: this.s_stored_value };
        break;

    }

  }

  json_get_value({ json, name } = {}) {
    let result = "";

    // A minimal reader for one string field of a flat JSON object: find
    // `"<name>":"` and take what stands up to the next quote. The model writes
    // the ABAP component names in upper case, hence the case-insensitive
    // search. An app parsing arbitrary JSON wants a real parser instead.
    const lv_marker = `"${name}":"`;

    const lv_off = json.toLowerCase().indexOf(lv_marker.toLowerCase());
    if (lv_off < 0) {
      return result;
    }

    result = ((json.substr(lv_off + lv_marker.length)).includes(("\"")) ? (json.substr(lv_off + lv_marker.length)).slice(0, (json.substr(lv_off + lv_marker.length)).indexOf(("\""))) : "");

    return result;
  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",   v: "sap.ui.core" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" })
            .a({ n: "xmlns:z2ui5",  v: "z2ui5.cc" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Browser - Local and Session Storage" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text", v: "Reads and writes the browser's local or session storage. The " +
                   "value is a whole ABAP structure, not just a string: the write " +
                   "side sends it with the STORE_DATA frontend action, the invisible " +
                   "z2ui5:Storage control reads it back and reports it as JSON." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Local/Session Storage" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Label")
                .a({ n: "text",           v: "Type" })
            .ele("Select")
                .a({ n: "forceSelection", b: true })
                .a({ n: "selectedKey",    v: this.client._bind("s_storage-type") })
                .a({ n: "items",          v: this.client._bind("t_types") })
                .tag({ n: "Item", ns: "core" })
                    .a({ n: "key",  v: "{TYPE}" })
                    .a({ n: "text", v: "{TYPE}" })
            .end()
            .tag("Label")
                .a({ n: "text",  v: "Prefix" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("s_storage-prefix") })
            .tag("Label")
                .a({ n: "text",  v: "Key" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("s_storage-key") })
            .tag("Label")
                .a({ n: "text",  v: "Value - Field 1" })
            .tag("Input")
                .a({ n: "type",  v: "Number" })
                .a({ n: "value", v: this.client._bind("s_storage-value-field1") })
            .tag("Label")
                .a({ n: "text",  v: "Value - Field 2" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("s_storage-value-field2") })
            .tag("Label")
                .a({ n: "text",  v: "" })
            .tag("Button")
                .a({ n: "press", v: this.client.follow_up_action({
                           val:   z2ui5_if_client.cs_event.store_data,
                           t_arg: [ `$${this.client._bind("s_storage")}` ] }) })
                .a({ n: "text",  v: "store" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("GET_STORED_VALUE") })
                .a({ n: "text",  v: "get" });

    // Invisible companion control: it reads `key` out of the selected storage
    // and fires `finished` when the stored value differs from `value`. The
    // comparison is by value, so a structure does not re-trigger on every
    // render.
    page.tag({ n: "Storage", ns: "z2ui5" })
        .a({ n: "finished", v: this.client._event({ val:   "LOCAL_STORAGE_LOADED",
                                   t_arg: [ "${$parameters>/type}",
                                                    "${$parameters>/prefix}",
                                                    "${$parameters>/key}",
                                                    "${$parameters>/value}" ] }) })
        .a({ n: "type",   v: this.client._bind("s_storage-type") })
        .a({ n: "prefix", v: this.client._bind("s_storage-prefix") })
        .a({ n: "key",    v: this.client._bind("s_storage-key") })
        .a({ n: "value",  v: this.client._bind("s_stored_value") });

    this.client.view_display(view.stringify());

  }
});
