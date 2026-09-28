/**
 * Table - Editable Cells, Add and Delete Rows
 *
 * An editable table: input cells, adding and deleting rows, multi-select and a
 * toolbar over them.
 *
 * @keywords edit input add row delete multiselect toolbar
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_011.clas.abap
 */
import { defineApp, t, ViewBuilder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_011", class {
  t_tab = t.table({
    selkz: false,
    title: "",
    value: "",
    descr: "",
    icon: "",
    info: "",
    editable: false,
    checkbox: false,
  });
  check_editable_active = false;

  viewDisplay(c) {

    const view = ViewBuilder.factory()
        .ele("View", "mvc")
            .a("displayBlock", "true")
            .a("height", "100%")
            .a("xmlns", "sap.m")
            .a("xmlns:mvc", "sap.ui.core.mvc");
    const page = view.ele("Shell")
        .ele("Page")
            .a("title", "cap2UI5 - Table - Editable Cells, Add and Delete Rows")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack())
            .a("id", "test2");

    page.tag("MessageStrip")
        .a("text", "A MultiSelect table whose input cells switch between display and edit mode via the " +
                   "toolbar, which also adds new rows and deletes the currently selected ones.")
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    const tab = page.ele("Table")
        .a("items", `{path: '${c.bind("t_tab", { path: true })}', templateShareable: false}`)
        .a("mode", "MultiSelect")
        .ele("headerToolbar")
            .ele("OverflowToolbar")
                .tag("Title")
                    .a("text", "title of the table")
                .tag("Button")
                    // shows an OverflowToolbar filling up - the press is a plain roundtrip
                    .a("press", c.event("BUTTON_TEST"))
                    .a("text", "test")
                .tag("ToolbarSpacer")
                .tag("Button")
                    .a("press", c.event("BUTTON_DELETE"))
                    .a("text", "delete selected row")
                    .a("icon", "sap-icon://delete")
                .tag("Button")
                    .a("press", c.event("BUTTON_ADD"))
                    .a("text", "add")
                    .a("icon", "sap-icon://add")
                .tag("Button")
                    .a("press", c.event("BUTTON_EDIT"))
                    .a("text", { t: this.check_editable_active ? "display" : "edit" })
                    .a("tooltip", "Switch the cells between display and edit mode")
                    .a("icon", "sap-icon://edit")
            .end()
        .end();

    tab.ele("columns")
        .ele("Column")
            .tag("Text")
                .a("text", "Title")
        .end()
        .ele("Column")
            .tag("Text")
                .a("text", "Color")
        .end()
        .ele("Column")
            .tag("Text")
                .a("text", "Info")
        .end()
        .ele("Column")
            .tag("Text")
                .a("text", "Description")
        .end()
        .ele("Column")
            .tag("Text")
                .a("text", "Checkbox");

    tab.ele("items")
        .ele("ColumnListItem")
            .a("selected", "{SELKZ}")
            .ele("cells")
                .tag("Input")
                    .a("id", "test")
                    .a("enabled", "{EDITABLE}")
                    .a("value", "{TITLE}")
                .tag("Input")
                    .a("enabled", "{EDITABLE}")
                    .a("value", "{VALUE}")
                .tag("Input")
                    .a("enabled", "{EDITABLE}")
                    .a("value", "{INFO}")
                .tag("Input")
                    .a("enabled", "{EDITABLE}")
                    .a("value", "{DESCR}")
                .tag("CheckBox")
                    .a("selected", "{CHECKBOX}")
                    .a("enabled", "{EDITABLE}");

    c.view(view);

  }

  main(c) {

    if (c.isFirstRun) {

      this.check_editable_active = false;
      this.t_tab = [
        { title: "entry 01", value: "red", info: "completed", descr: "this is a description", checkbox: true },
        { title: "entry 02", value: "blue", info: "completed", descr: "this is a description", checkbox: true },
        { title: "entry 03", value: "green", info: "completed", descr: "this is a description", checkbox: true },
        { title: "entry 04", value: "orange", info: "completed", descr: "", checkbox: true },
        { title: "entry 05", value: "grey", info: "completed", descr: "this is a description", checkbox: true },
        {},
      ];

      this.viewDisplay(c);
    } else if (c.isDisplay) {
      this.viewDisplay(c);

    } else if (c.eventName === "BUTTON_EDIT") {
      // a read is a copy of the table: the changed rows are written back whole
      this.check_editable_active = !this.check_editable_active;
      this.t_tab = this.t_tab.map((row) => ({ ...row, editable: this.check_editable_active }));

    } else if (c.eventName === "BUTTON_DELETE") {
      this.t_tab = this.t_tab.filter((row) => !row.selkz);

    } else if (c.eventName === "BUTTON_ADD") {

      this.t_tab = [...this.t_tab, { editable: this.check_editable_active }];
    }

  }
});
