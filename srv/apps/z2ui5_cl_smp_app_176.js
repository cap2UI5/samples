// @keywords template repeat runtime generated nested nest_view_display
// @summary XML templating inside a nested view: the generated content is built where the sub view is rendered.
// @docs https://abap2ui5.github.io/docs/cookbook/view/nested_views https://abap2ui5.github.io/docs/cookbook/view/xml_templating
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_176.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "cap2ui5";

const ty_s_data = {
  name: "",
  date: "",
  age:  "",
};

const ty_s_layout = {
  fname:   "",
  title:   "",
  merge:   "",
  visible: "",
  binding: "",
};

defineApp("Z2UI5_CL_SMP_APP_176", class {

  mt_layout = t.table(ty_s_layout);
  mt_data   = t.table(ty_s_data);

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.mt_data = [ { name: "Theo", date: "01.01.2000", age: "5" },
                        { name: "Lore", date: "01.01.2000", age: "1" } ];

      this.mt_layout = [ { fname: "NAME", title: "Name", merge: "false", visible: "true",  binding: "{NAME}" },
                          { fname: "DATE", title: "Date", merge: "false", visible: "true",  binding: "{DATE}" },
                          { fname: "AGE",  title: "Age",  merge: "false", visible: "false", binding: "{AGE}" } ];

      this.view_display();
      this.nest_view_display();

    } else if (client.check_on_navigated()) {

      this.view_display();
      this.nest_view_display();

    }

  }

  view_display() {

    const lo_view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    const page = lo_view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Templating - Dynamic Content in a Nested View" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() })
            .a({ n: "id",             v: "test" });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "This sample renders a main view and then embeds a second view into it as " +
                   "nested content via nest_view_display; the nested table builds its columns and cells " +
                   "at runtime with template:repeat over a layout table." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    this.client.view_display(lo_view.stringify());

  }

  nest_view_display() {

    // the template model is the view model, so the list the repeat runs over
    // is a bound attribute - its path is composed from the bind call, never
    // written by hand
    const layout_path = `{template>${this.client._bind({ val: "mt_layout", path: true })}}`;

    const lo_view_nested = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock",   v: "true" })
            .a({ n: "height",         v: "100%" })
            .a({ n: "xmlns",          v: "sap.m" })
            .a({ n: "xmlns:mvc",      v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:template", v: "http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1" });

    lo_view_nested.ele("Shell")
        .ele("Page")
            .a({ n: "title", v: "Nested View" })
            .ele("Table")
                .a({ n: "items", v: this.client._bind("mt_data") })
                .ele("columns")
                    .ele({ n: "repeat", ns: "template" })
                        .a({ n: "list", v: layout_path })
                        .a({ n: "var",  v: "LO" })
                        .ele("Column")
                            .a({ n: "mergeDuplicates", v: "{LO>MERGE}" })
                            .a({ n: "visible",         v: "{LO>VISIBLE}" })
                            .tag("Text")
                                .a({ n: "text", v: "{LO>TITLE}" })
                        .end()
                    .end()
                .end()
                .ele("items")
                    .ele("ColumnListItem")
                        .ele("cells")
                            .ele({ n: "repeat", ns: "template" })
                                .a({ n: "list", v: layout_path })
                                .a({ n: "var",  v: "LO2" })
                                .ele("ObjectIdentifier")
                                    .a({ n: "text", v: "{= '{' + ${LO2>FNAME} + '}' }" });

    this.client.nest_view_display({ val: lo_view_nested.stringify(), id: "test", method_insert: "addContent", method_destroy: "removeAllContent" });

  }
});
