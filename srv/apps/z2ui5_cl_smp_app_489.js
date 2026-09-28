/**
 * Navigation - Data Input App (called by Z2UI5_CL_SMP_APP_488)
 *
 * Returns to its caller with c.navBack( { event } ) - handing back an event
 * name without knowing which app called it; the caller reads the entered data
 * from c.prevApp. A hidden helper, never listed on its own in the overview.
 *
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_489.clas.abap
 */
import { defineApp } from "cap2ui5";

const INFO =
  "Change the data and return: 'confirm' leaves with event DATA_CONFIRMED, the caller reads " +
  "the entered data from c.prevApp; 'cancel' leaves with event DATA_CANCELLED. " +
  "The nav-back button of the page leaves without an event.";

defineApp("Z2UI5_CL_SMP_APP_489", class {
  s_result = { product: "Notebook Basic 15", quantity: "2" };

  main(c) {
    if (c.isDisplay) {
      c.view(view(c));
    } else if (c.eventName === "CONFIRM") {
      c.navBack({ event: "DATA_CONFIRMED" });
    } else if (c.eventName === "CANCEL") {
      c.navBack({ event: "DATA_CANCELLED" });
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});

function view(c) {
  return `
    <mvc:View
        xmlns:mvc="sap.ui.core.mvc"
        xmlns="sap.m"
        xmlns:form="sap.ui.layout.form"
        xmlns:layout="sap.ui.layout"
        displayBlock="true"
        height="100%">
      <Shell>
        <Page
            title="cap2UI5 - Navigation - Data Input App"
            showNavButton="${c.canGoBack}"
            navButtonPress="${c.event("BACK")}">
          <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
          <layout:Grid defaultSpan="L6 M12 S12">
            <layout:content>
              <form:SimpleForm
                  title="Data returned to the caller"
                  editable="true"
                  binding="${c.bind("s_result")}">
                <form:content>
                  <Label text="Product"/>
                  <Input value="{PRODUCT}"/>
                  <Label text="Quantity"/>
                  <Input value="{QUANTITY}"/>
                  <Label text="Return to the caller"/>
                  <Button press="${c.event("CONFIRM")}" text="confirm (event, data in c.prevApp)" type="Emphasized"/>
                  <Button press="${c.event("CANCEL")}" text="cancel (event only)"/>
                </form:content>
              </form:SimpleForm>
            </layout:content>
          </layout:Grid>
        </Page>
      </Shell>
    </mvc:View>`;
}
