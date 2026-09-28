// @keywords template repeat runtime generated columns if then else
// @summary Builds the columns of a table at runtime with template:repeat, including the if/then/else the templating language brings.
// @docs https://abap2ui5.github.io/docs/cookbook/view/xml_templating
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_173.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "cap2ui5";

const ty_s_data = {
  name: "",
  date: "",
  age:  "",
};

const ty_s_layout = {
  fname:   "",
  merge:   "",
  visible: "",
};

defineApp("Z2UI5_CL_SMP_APP_173", class {

  mv_flag = false;
  mt_layout = t.table(ty_s_layout);
  mt_data   = t.table(ty_s_data);

  view_display() {

    // the template model is the view model, so what the repeat and the if
    // read are bound attributes - their paths are composed from the bind
    // call, never written by hand
    const layout_path = `{template>${this.client._bind({ val: "mt_layout", path: true })}}`;
    const flag_path   = `{template>${this.client._bind({ val: "mv_flag", path: true })}}`;

    let view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock",   v: "true" })
            .a({ n: "height",         v: "100%" })
            .a({ n: "xmlns",          v: "sap.m" })
            .a({ n: "xmlns:mvc",      v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",     v: "sap.ui.core" })
            .a({ n: "xmlns:template", v: "http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1" });

    view           = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Templating - Build Columns Dynamically (template:repeat)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() })
            .a({ n: "class",          v: "sapUiContentPadding" })
            .a({ n: "id",             v: "page_main" });

    view.tag("MessageStrip")
        .a({ n: "text",     v: "This sample builds table columns and cells dynamically from a layout table " +
                   "using template repeat, plus a template if/then/else that re-renders on a switch." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    view.ele("Table")
        .a({ n: "items", v: this.client._bind("mt_data") })
        .ele("columns")
            .ele({ n: "repeat", ns: "template" })
                .a({ n: "list", v: layout_path })
                .a({ n: "var",  v: "L0" })
                .ele("Column")
                    .a({ n: "mergeDuplicates", v: "{L0>MERGE}" })
                    .a({ n: "visible",         v: "{L0>VISIBLE}" })
                    .tag("Text")
                        .a({ n: "text", v: "{L0>FNAME}" })
                .end()
            .end()
        .end()
        .ele("items")
            .ele("ColumnListItem")
                .ele("cells")
                    .ele({ n: "repeat", ns: "template" })
                        .a({ n: "list", v: layout_path })
                        .a({ n: "var",  v: "L1" })
                        .ele("ObjectIdentifier")
                            .a({ n: "text", v: "{= '{' + ${L1>FNAME} + '}' }" });

    view.tag("Label")
        .a({ n: "text", v: "IF Template (with re-rendering)" });
    view.tag("Switch")
        .a({ n: "state",  v: this.client._bind("mv_flag") })
        .a({ n: "change", v: this.client._event("CHANGE_FLAG") });
                  view   = view.ele("VBox");

    view.ele({ n: "if", ns: "template" })
        .a({ n: "test", v: flag_path })
        .ele({ n: "then", ns: "template" })
            .tag({ n: "Icon", ns: "core" })
                .a({ n: "color", v: "green" })
                .a({ n: "src",   v: "sap-icon://accept" })
        .end()
        .ele({ n: "else", ns: "template" })
            .tag({ n: "Icon", ns: "core" })
                .a({ n: "color", v: "red" })
                .a({ n: "src",   v: "sap-icon://decline" });

    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;

    if (client.check_on_init()) {

      this.mt_data = [ { name: "Theo", date: "01.01.2000", age: "5" },
                        { name: "Lore", date: "01.01.2000", age: "1" } ];

      this.mt_layout = [ { fname: "NAME", merge: "false", visible: "true" },
                          { fname: "DATE", merge: "false", visible: "true" },
                          { fname: "AGE",  merge: "false", visible: "false" } ];

      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("CHANGE_FLAG")) {
      this.view_display();
    }

  }
});
