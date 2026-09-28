/**
 * Event - Extra Arguments with the Event
 *
 * Sends extra arguments with an event (c.event( name, [args] )), so a handler
 * knows which row, which value or which fixed payload it was called for.
 *
 * @keywords argument parameter payload event data fixed value eventArg
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_167.clas.abap
 */
import { defineApp } from "cap2ui5";

const INFO =
  "This sample shows how to pass extra arguments to an event via c.event( name, [args] ) - fixed " +
  "values, model values, or client-side expressions - and read them in the backend with c.eventArg(1).";

const EVENTS = [
  "EVENT_FIX_VAL",
  "EVENT_MODEL_VALUE",
  "SOURCE_PROPERTY_TEXT",
  "EVENT_PROPERTY_VALUE",
  "PARENT_PROPERTY_ID",
];

defineApp("Z2UI5_CL_SMP_APP_167", class {
  mv_value = "my value";

  main(c) {
    // An argument starting with $ is evaluated in the browser when the event
    // fires: a binding, a property of the control that fired, an event parameter.
    if (c.isDisplay) {
      c.view(`
        <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
          <Shell>
            <Page
                title="cap2UI5 - Event - Extra Arguments with the Event"
                showNavButton="${c.canGoBack}"
                navButtonPress="${c.event("BACK")}">
              <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
              <Link
                  text="More information..."
                  target="_blank"
                  href="https://sdk.openui5.org/topic/b0fb4de7364f4bcbb053a99aa645affe"/>
              <Button
                  press="${c.event("EVENT_FIX_VAL", ["FIX_VAL"])}"
                  text="EVENT_FIX_VAL"/>
              <Input value="${c.bind("mv_value")}"/>
              <Button
                  press="${c.event("EVENT_MODEL_VALUE", ["$" + c.bind("mv_value")])}"
                  text="EVENT_MODEL_VALUE"/>
              <Button
                  press="${c.event("SOURCE_PROPERTY_TEXT", ["${$source>/text}"])}"
                  text="SOURCE_PROPERTY_TEXT"/>
              <Input
                  description="make an input and press enter - "
                  submit="${c.event("EVENT_PROPERTY_VALUE", ["${$parameters>/value}"])}"/>
              <Button
                  press="${c.event("PARENT_PROPERTY_ID", ["$event.oSource.oParent.sId"])}"
                  text="PARENT_PROPERTY_ID"/>
            </Page>
          </Shell>
        </mvc:View>`);
    } else if (EVENTS.includes(c.eventName)) {
      c.messageBox(`backend event: ${c.eventArg(1)}`);
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});
