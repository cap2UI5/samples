// @keywords edit input add row delete multiselect toolbar
// @summary An editable table: input cells, adding and deleting rows, multi-select and a toolbar over them.
// @docs https://abap2ui5.github.io/docs/cookbook/model/tables https://abap2ui5.github.io/docs/tutorials/walkthrough/step-8 https://abap2ui5.github.io/docs/tutorials/walkthrough/step-10
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_011.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_011", class {

  t_tab = t.table({
    selkz:    false,
    title:    "",
    value:    "",
    descr:    "",
    icon:     "",
    info:     "",
    editable: false,
    checkbox: false,
  });

  check_editable_active = false;

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Table - Editable Cells, Add and Delete Rows" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() })
            .a({ n: "id",             v: "test2" });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "A MultiSelect table whose input cells switch between display and edit mode via the " +
                               "toolbar, which also adds new rows and deletes the currently selected ones." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const tab = page.ele("Table")
        .a({ n: "items", v: `{path: '${this.client._bind({ val: "t_tab", path: true })}', templateShareable: false}` })
        .a({ n: "mode",  v: "MultiSelect" })
        .ele("headerToolbar")
            .ele("OverflowToolbar")
                .tag("Title")
                    .a({ n: "text", v: "title of the table" })
                .tag("Button")
                    // shows an OverflowToolbar filling up - the press is a plain roundtrip
                    .a({ n: "press", v: this.client._event("BUTTON_TEST") })
                    .a({ n: "text",  v: "test" })
                .tag("ToolbarSpacer")
                .tag("Button")
                    .a({ n: "press", v: this.client._event("BUTTON_DELETE") })
                    .a({ n: "text",  v: "delete selected row" })
                    .a({ n: "icon",  v: "sap-icon://delete" })
                .tag("Button")
                    .a({ n: "press", v: this.client._event("BUTTON_ADD") })
                    .a({ n: "text",  v: "add" })
                    .a({ n: "icon",  v: "sap-icon://add" })
                .tag("Button")
                    .a({ n: "press", v: this.client._event("BUTTON_EDIT") })
                    .a({ n: "text",  t: this.check_editable_active ? "display" : "edit" })
                    .a({ n: "tooltip", v: "Switch the cells between display and edit mode" })
                    .a({ n: "icon",  v: "sap-icon://edit" })
            .end()
        .end();

    tab.ele("columns")
        .ele("Column")
            .tag("Text")
                .a({ n: "text", v: "Title" })
        .end()
        .ele("Column")
            .tag("Text")
                .a({ n: "text", v: "Color" })
        .end()
        .ele("Column")
            .tag("Text")
                .a({ n: "text", v: "Info" })
        .end()
        .ele("Column")
            .tag("Text")
                .a({ n: "text", v: "Description" })
        .end()
        .ele("Column")
            .tag("Text")
                .a({ n: "text", v: "Checkbox" });

    tab.ele("items")
        .ele("ColumnListItem")
            .a({ n: "selected", v: "{SELKZ}" })
            .ele("cells")
                .tag("Input")
                    .a({ n: "id",      v: "test" })
                    .a({ n: "enabled", v: "{EDITABLE}" })
                    .a({ n: "value",   v: "{TITLE}" })
                .tag("Input")
                    .a({ n: "enabled", v: "{EDITABLE}" })
                    .a({ n: "value",   v: "{VALUE}" })
                .tag("Input")
                    .a({ n: "enabled", v: "{EDITABLE}" })
                    .a({ n: "value",   v: "{INFO}" })
                .tag("Input")
                    .a({ n: "enabled", v: "{EDITABLE}" })
                    .a({ n: "value",   v: "{DESCR}" })
                .tag("CheckBox")
                    .a({ n: "selected", v: "{CHECKBOX}" })
                    .a({ n: "enabled",  v: "{EDITABLE}" });

    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;

    if (client.check_on_init()) {

      this.check_editable_active = false;
      this.t_tab                 = [
          { title: "entry 01", value: "red",    info: "completed", descr: "this is a description", checkbox: true },
          { title: "entry 02", value: "blue",   info: "completed", descr: "this is a description", checkbox: true },
          { title: "entry 03", value: "green",  info: "completed", descr: "this is a description", checkbox: true },
          { title: "entry 04", value: "orange", info: "completed", descr: "", checkbox: true },
          { title: "entry 05", value: "grey",   info: "completed", descr: "this is a description", checkbox: true },
          { } ];

      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();

    } else if (client.check_on_event("BUTTON_EDIT")) {
      this.check_editable_active = !this.check_editable_active;
      // a read of t_tab is a copy: the changed rows are written back whole
      this.t_tab = this.t_tab.map((row) => ({ ...row, editable: this.check_editable_active }));

    } else if (client.check_on_event("BUTTON_DELETE")) {
      this.t_tab = this.t_tab.filter((row) => !row.selkz);

    } else if (client.check_on_event("BUTTON_ADD")) {

      this.t_tab = [...this.t_tab, { editable: this.check_editable_active }];
    }

  }
});
