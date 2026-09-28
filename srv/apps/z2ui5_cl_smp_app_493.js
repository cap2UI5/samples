/**
 * Basics I - Hello World, the Smallest App
 *
 * The smallest app that runs: one class, one c.view( ), a Page with a title -
 * the shape every other sample starts from.
 *
 * @keywords hello world smallest first app minimal start here template
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_493.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

const INFO =
  "The whole app is what you see below: a class handed to defineApp( ), one main( ) method, " +
  "a view built with ViewBuilder and handed to c.view( ). cap2UI5 calls main( ) on every " +
  "roundtrip - here only the display matters, which is what c.isDisplay asks: true on the " +
  "first start and whenever the app is shown again. Copy this file as the starting point for " +
  "your own app.";

defineApp("Z2UI5_CL_SMP_APP_493", class {

  main(c) {
    if (c.isDisplay) {

      const view = ViewBuilder.factory()
          .ele("View", "mvc")
              .a("displayBlock", "true")
              .a("height", "100%")
              .a("xmlns", "sap.m")
              .a("xmlns:mvc", "sap.ui.core.mvc");
      const page = view.ele("Shell")
          .ele("Page")
              .a("title", "cap2UI5 - Basics I - Hello World, the Smallest App")
              .a("showNavButton", c.canGoBack)
              .a("navButtonPress", c.eventNavBack());

      page.tag("MessageStrip")
          .a("text", INFO)
          .a("type", "Information")
          .a("showIcon", true)
          .a("class", "sapUiSmallMargin");

      page.tag("Title")
          .a("text", "Hello World")
          .a("class", "sapUiSmallMargin")
          .a("level", "H2");
      c.view(view);

    }
  }
});
