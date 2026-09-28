/**
 * Basics II - Data Binding: Input and Button
 *
 * Binds a field of the class to an Input with c.bind( ), so what the user types
 * is in the field on the next roundtrip - a Text shows it back and a MessageBox
 * confirms the roundtrip.
 *
 * @keywords binding bind model field value input button roundtrip messagebox
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_494.clas.abap
 */
import { defineApp } from "cap2ui5";

const INFO =
  "c.bind('name') connects the field NAME with the input below. Type a name and leave the " +
  "field: the text next to it changes without any backend code, because both are bound to the " +
  "same field. Press Greet and the backend reads NAME - already filled in, no event argument " +
  "needed -, writes GREETING back into the view and confirms the roundtrip with a MessageBox.";

defineApp("Z2UI5_CL_SMP_APP_494", class {
  name = "World";
  greeting = "";

  main(c) {
    if (c.isDisplay) {
      c.view(`
        <mvc:View
            xmlns:mvc="sap.ui.core.mvc"
            xmlns="sap.m"
            xmlns:form="sap.ui.layout.form"
            displayBlock="true"
            height="100%">
          <Shell>
            <Page
                title="cap2UI5 - Basics II - Data Binding: Input and Button"
                showNavButton="${c.canGoBack}"
                navButtonPress="${c.event("BACK")}">
              <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
              <form:SimpleForm title="Data Binding" editable="true">
                <form:content>
                  <Label text="your name"/>
                  <Input value="${c.bind("name")}"/>
                  <Label text="bound to the same field"/>
                  <Text text="${c.bind("name")}"/>
                  <Label text="written by the backend"/>
                  <Text text="${c.bind("greeting")}"/>
                  <Button press="${c.event("GREET")}" text="Greet"/>
                </form:content>
              </form:SimpleForm>
            </Page>
          </Shell>
        </mvc:View>`);
    } else if (c.eventName === "GREET") {
      this.greeting = `Hello ${this.name}!`;
      c.messageBox(
        `Roundtrip done: the backend read NAME = '${this.name}' and wrote GREETING back into the view.`);
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});
