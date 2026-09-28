/**
 * Basics III - Lifecycle: First Run, Event, Display
 *
 * The three questions main( ) asks - c.isFirstRun, c.eventName, c.isDisplay -
 * as one dispatcher, showing what survives a roundtrip and what a navigation
 * does to it.
 *
 * @keywords lifecycle roundtrip main dispatcher state draft isFirstRun isDisplay eventName
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_495.clas.abap
 */
import { defineApp, t, ViewBuilder } from "cap2ui5";

const INFO =
  "main( ) runs on every roundtrip - c.isFirstRun, c.isDisplay and c.eventName tell it what " +
  "the roundtrip is about. The list logs each call, and it survives them all: every field of " +
  "the class is kept in the draft between the roundtrips, so the app keeps its state without " +
  "a table of its own. Press Log - only the model is pushed, the view is not rebuilt. Call the " +
  "sub-app and come back with its back button - that is the roundtrip c.isDisplay answers " +
  "without c.isFirstRun.";

defineApp("Z2UI5_CL_SMP_APP_495", class {
  t_log = t.table({ no: "", check: "" });

  main(c) {
    if (c.isFirstRun) {

      this.logStep("c.isFirstRun - the very first call, nothing exists yet");
      this.viewDisplay(c);

    } else if (c.isDisplay) {

      this.logStep("c.isDisplay - the sub-app returned, re-display the view");
      this.viewDisplay(c);

    } else if (c.eventName === "LOG") {
      this.logStep("c.eventName - a button was pressed, the view stays as it is");

    } else if (c.eventName === "CALL") {

      this.logStep("c.eventName - calling Basics I as a sub-app");
      c.navTo("Z2UI5_CL_SMP_APP_493");

    }
  }

  logStep(val) {
    // a read is a copy of the table: the changed table is written back whole
    this.t_log = [...this.t_log, { no: String(this.t_log.length + 1), check: val }];
  }

  viewDisplay(c) {

    const view = ViewBuilder.factory()
        .ele("View", "mvc")
            .a("displayBlock", "true")
            .a("height", "100%")
            .a("xmlns", "sap.m")
            .a("xmlns:mvc", "sap.ui.core.mvc");
    const page = view.ele("Shell")
        .ele("Page")
            .a("title", "cap2UI5 - Basics III - Lifecycle: First Run, Event, Display")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack());

    page.tag("MessageStrip")
        .a("text", INFO)
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    page.ele("HBox")
        .a("class", "sapUiSmallMargin")
        .tag("Button")
            .a("press", c.event("LOG"))
            .a("text", "Log an Event")
        .tag("Button")
            .a("press", c.event("CALL"))
            .a("text", "Call a Sub-App")
            .a("class", "sapUiTinyMarginBegin");

    page.ele("List")
        .a("headerText", "Calls of main( )")
        .a("items", c.bind("t_log"))
        .a("class", "sapUiSmallMargin")
        .tag("StandardListItem")
            .a("title", "{CHECK}")
            .a("description", "call {NO}");

    c.view(view);

  }
});
