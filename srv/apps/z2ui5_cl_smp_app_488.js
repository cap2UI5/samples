/**
 * Navigation - Return Data and Events to the Caller
 *
 * The way back carries data: the called app returns with an event name, and
 * the caller reads what it entered from c.prevApp.
 *
 * Calls a second app (Z2UI5_CL_SMP_APP_489) with c.navTo( ). The called app
 * comes back with c.navBack( { event } ), without knowing who called it. On
 * return this app is shown again - c.isDisplay - and finds the event name in
 * c.eventName and the called app's fields, as plain values, in c.prevApp.
 *
 * @keywords navTo navBack prevApp result return event payload
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_488.clas.abap
 */
import { defineApp } from "cap2ui5";

const INFO =
  "Calls a second app that returns via c.navBack( { event } ). On return this app reads the " +
  "event from c.eventName and the entered data from c.prevApp in its c.isDisplay branch and " +
  "shows them below.";

defineApp("Z2UI5_CL_SMP_APP_488", class {
  s_result = { product: "", quantity: "" };
  returned_event = "";

  main(c) {
    if (c.isFirstRun) {
      c.view(view(c));
    } else if (c.isDisplay) {
      this.returned_event = c.eventName;
      if (c.eventName === "DATA_CONFIRMED") {
        this.s_result = c.prevApp.s_result;
        c.messageToast(`Returned event ${this.returned_event}, ` +
          `product ${this.s_result.product}, quantity ${this.s_result.quantity}`);
      } else if (c.eventName === "DATA_CANCELLED") {
        this.s_result = { product: "", quantity: "" };
        c.messageToast("Returned event DATA_CANCELLED, no data passed");
      }
      c.view(view(c));
    } else if (c.eventName === "CALL_APP") {
      c.navTo("Z2UI5_CL_SMP_APP_489");
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});

function view(c) {
  // binding="{/S_RESULT}" makes the structure the form's context, so the
  // fields inside bind its components relatively: {PRODUCT}, {QUANTITY}
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
            title="cap2UI5 - Navigation - Return Data and Events to the Caller"
            showNavButton="${c.canGoBack}"
            navButtonPress="${c.event("BACK")}">
          <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
          <layout:Grid defaultSpan="L6 M12 S12">
            <layout:content>
              <form:SimpleForm
                  title="Result returned by the called app"
                  editable="true"
                  binding="${c.bind("s_result")}">
                <form:content>
                  <Label text="Open the input app"/>
                  <Button press="${c.event("CALL_APP")}" text="call app (c.navTo)" type="Emphasized"/>
                  <Label text="Returned event"/>
                  <Input enabled="false" value="${c.bind("returned_event")}"/>
                  <Label text="Returned product"/>
                  <Input enabled="false" value="{PRODUCT}"/>
                  <Label text="Returned quantity"/>
                  <Input enabled="false" value="{QUANTITY}"/>
                </form:content>
              </form:SimpleForm>
            </layout:content>
          </layout:Grid>
        </Page>
      </Shell>
    </mvc:View>`;
}
