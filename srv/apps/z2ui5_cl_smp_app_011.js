/**
 * Table - Editable Cells, Add and Delete Rows
 *
 * An editable table: input cells, adding and deleting rows, multi-select and a
 * toolbar over them.
 *
 * @keywords edit input add row delete multiselect toolbar
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_011.clas.abap
 */
import { defineApp, t } from "cap2ui5";

const INFO =
  "A MultiSelect table whose input cells switch between display and edit mode via the " +
  "toolbar, which also adds new rows and deletes the currently selected ones.";

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

  main(c) {
    if (c.isFirstRun) {
      this.t_tab = [
        { title: "entry 01", value: "red", info: "completed", descr: "this is a description", checkbox: true },
        { title: "entry 02", value: "blue", info: "completed", descr: "this is a description", checkbox: true },
        { title: "entry 03", value: "green", info: "completed", descr: "this is a description", checkbox: true },
        { title: "entry 04", value: "orange", info: "completed", descr: "", checkbox: true },
        { title: "entry 05", value: "grey", info: "completed", descr: "this is a description", checkbox: true },
        {},
      ];
    }

    if (c.isDisplay) {
      c.view(view(c, this));
    } else if (c.eventName === "BUTTON_EDIT") {
      // `this` reads plain copies: a changed table is written back by assigning it
      this.check_editable_active = !this.check_editable_active;
      this.t_tab = this.t_tab.map((row) => ({ ...row, editable: this.check_editable_active }));
    } else if (c.eventName === "BUTTON_DELETE") {
      this.t_tab = this.t_tab.filter((row) => !row.selkz);
    } else if (c.eventName === "BUTTON_ADD") {
      this.t_tab = [...this.t_tab, { editable: this.check_editable_active }];
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});

function view(c, app) {
  return `
    <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
      <Shell>
        <Page
            title="cap2UI5 - Table - Editable Cells, Add and Delete Rows"
            showNavButton="${c.canGoBack}"
            navButtonPress="${c.event("BACK")}">
          <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
          <Table items="${c.bind("t_tab")}" mode="MultiSelect">
            <headerToolbar>
              <OverflowToolbar>
                <Title text="title of the table"/>
                <Button press="${c.event("BUTTON_TEST")}" text="test"/>
                <ToolbarSpacer/>
                <Button press="${c.event("BUTTON_DELETE")}" text="delete selected row" icon="sap-icon://delete"/>
                <Button press="${c.event("BUTTON_ADD")}" text="add" icon="sap-icon://add"/>
                <Button
                    press="${c.event("BUTTON_EDIT")}"
                    text="${app.check_editable_active ? "display" : "edit"}"
                    tooltip="Switch the cells between display and edit mode"
                    icon="sap-icon://edit"/>
              </OverflowToolbar>
            </headerToolbar>
            <columns>
              <Column><Text text="Title"/></Column>
              <Column><Text text="Color"/></Column>
              <Column><Text text="Info"/></Column>
              <Column><Text text="Description"/></Column>
              <Column><Text text="Checkbox"/></Column>
            </columns>
            <items>
              <ColumnListItem selected="{SELKZ}">
                <cells>
                  <Input enabled="{EDITABLE}" value="{TITLE}"/>
                  <Input enabled="{EDITABLE}" value="{VALUE}"/>
                  <Input enabled="{EDITABLE}" value="{INFO}"/>
                  <Input enabled="{EDITABLE}" value="{DESCR}"/>
                  <CheckBox selected="{CHECKBOX}" enabled="{EDITABLE}"/>
                </cells>
              </ColumnListItem>
            </items>
          </Table>
        </Page>
      </Shell>
    </mvc:View>`;
}
