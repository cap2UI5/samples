/**
 * Basics I - Hello World, the Smallest App
 *
 * The smallest app that runs: one class, one c.view( ), a Page with a title -
 * the shape every other sample starts from.
 *
 * @keywords hello world smallest first app minimal start here template
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_493.clas.abap
 */
import { defineApp } from "cap2ui5";

const INFO =
  "The whole app is what you see below: a class handed to defineApp( ), one main( ) method, " +
  "a view written as XML and handed to c.view( ). cap2UI5 calls main( ) on every roundtrip - " +
  "here only the display matters, which is what c.isDisplay asks: true on the first start and " +
  "whenever the app is shown again. Copy this file as the starting point for your own app.";

defineApp("Z2UI5_CL_SMP_APP_493", class {

  main(c) {
    if (c.isDisplay) {
      c.view(`
        <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
          <Shell>
            <Page
                title="cap2UI5 - Basics I - Hello World, the Smallest App"
                showNavButton="${c.canGoBack}"
                navButtonPress="${c.event("BACK")}">
              <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
              <Title text="Hello World" class="sapUiSmallMargin" level="H2"/>
            </Page>
          </Shell>
        </mvc:View>`);
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});
