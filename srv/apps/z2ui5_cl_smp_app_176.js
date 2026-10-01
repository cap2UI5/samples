// @keywords xml templating xmlpreprocessor template:repeat meta model metamodel metadata driven dynamic columns nested view nest_view_display re-render refresh
// @summary XML templating inside a nested view: the columns come from a layout table via template:repeat, and a change to that table re-renders only the nested view with nest_view_display while the main view stays on screen.
// @docs https://abap2ui5.github.io/docs/cookbook/view/nested_views https://abap2ui5.github.io/docs/cookbook/view/xml_templating
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_176.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

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

    } else if (client.check_on_event("TOGGLE_AGE")) {

      // templating ran once, when the nested view was built - a changed
      // layout table only shows once the nested view is built again. The
      // main view is not sent, it stays on screen as it is
      // (a read of mt_layout is a copy: the AGE row is written back whole)
      this.mt_layout = this.mt_layout.map((age) => (age.fname === "AGE"
          ? { ...age, visible: age.visible === "true" ? "false" : "true" } : age));
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
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "This sample renders a main view and then embeds a second view into it as " +
                   "nested content via nest_view_display; the nested table builds its columns and cells " +
                   "at runtime with template:repeat over a layout table. The button changes that table and " +
                   "re-renders only the nested view." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.tag("Button")
        .a({ n: "text",  v: "Show / Hide Age Column" })
        .a({ n: "icon",  v: "sap-icon://refresh" })
        .a({ n: "press", v: this.client._event("TOGGLE_AGE") })
        .a({ n: "class", v: "sapUiSmallMarginBegin" });

    // the nested view goes into this box - a container of its own, so a
    // re-render replaces the nested view and nothing else on the page
    page.tag("VBox")
        .a({ n: "id", v: "box_nest" });

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
            .a({ n: "xmlns",          v: "sap.m" })
            .a({ n: "xmlns:mvc",      v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:template", v: "http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1" });

    lo_view_nested.ele("Panel")
        .a({ n: "headerText", v: "Nested View" })
        .a({ n: "class",      v: "sapUiSmallMarginTop" })
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

    this.client.nest_view_display({ val:            lo_view_nested.stringify(),
                                    id:             "box_nest",
                                    method_insert:  "addItem",
                                    method_destroy: "removeAllItems" });

  }
});
