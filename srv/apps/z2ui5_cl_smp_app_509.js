// @keywords binding json string spliced model node object array pre-serialized _bind json = abap_true no abap type
// @summary A string that already holds JSON is spliced into the model as a node instead of a quoted string - a list bound to an array nobody declared an ABAP type for.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_509.clas.abap
//
// Every bound value is serialized from its ABAP type. A string that
// already CONTAINS JSON - read from a table column, returned by a service,
// written by hand - would arrive as one quoted string. `_bind( val = x
// json = abap_true )` splices it into the model as a JSON node instead, so
// a list binds to the array and a text to a member, and no ABAP structure
// has to mirror keys that may not even be valid ABAP names. Outbound only:
// the client sends nothing back into that node.
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_509", class {

  products_json = "";
  config_json   = "";
  products_raw  = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      // what a service or a JSON column would hand over: an array with keys
      // no ABAP type declares, and an object with a key (`sap.app`) that no
      // ABAP component could even be named after
      this.products_json = "[ { \"name\": \"Notebook 15\\\"\", \"price\": 1299, \"tags\": \"hardware, mobile\" }," +
                      " { \"name\": \"USB-C Dock\", \"price\": 189, \"tags\": \"accessories\" }," +
                      " { \"name\": \"Headset\", \"price\": 79, \"tags\": \"audio, accessories\" } ]";
      this.config_json   = "{ \"title\": \"Products from JSON\", \"sap.app\": { \"id\": \"z2ui5.demo\", \"version\": \"1.0.0\" } }";
      this.products_raw  = this.products_json;
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    }

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Binding - Pre-serialized JSON (json)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Two strings hold JSON the app never parsed. Bound with json = abap_true they become " +
                   "model nodes: the list binds to the array, the title reads a member of the object - even " +
                   "one called sap.app. The same string bound the ordinary way arrives as text, which is " +
                   "what the last field shows." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const form = page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Spliced in as JSON" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" });

    form.tag("Label")
        .a({ n: "text", v: "a member of the object - its title" });
    // the bare path of the spliced object, so the view can reach into it
    form.tag("Text")
        // the member lives inside the JSON string, which only the client parses
        .a({ n: "text", v: `{${this.client._bind({ val: "config_json", json: true, path: true })}/title}` });

    form.tag("Label")
        .a({ n: "text", v: "a key no ABAP component could carry - sap.app/id" });
    form.tag("Text")
        .a({ n: "text", v: `{${this.client._bind({ val: "config_json", json: true, path: true })}/sap.app/id} version ` +
                             `{${this.client._bind({ val: "config_json", json: true, path: true })}/sap.app/version}` });

    form.tag("Label")
        .a({ n: "text", v: "the array, as an aggregation binding" });
    form.ele("List")
        .a({ n: "items", v: this.client._bind({ val:  "products_json",
                                             json: true }) })
        .tag("StandardListItem")
            .a({ n: "title",       v: "{name}" })
            .a({ n: "description", v: "{tags}" })
            .a({ n: "info",        v: "{price} EUR" });

    form.tag("Label")
        .a({ n: "text", v: "the same string, bound without json - one quoted string" });
    form.tag("TextArea")
        .a({ n: "value",    v: this.client._bind("products_raw") })
        .a({ n: "editable", b: false })
        .a({ n: "rows",     v: "4" })
        .a({ n: "width",    v: "100%" });

    this.client.view_display(view.stringify());

  }
});
