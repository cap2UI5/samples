/**
 * Event - Extra Arguments with the Event
 *
 * Sends extra arguments with an event (c.event( name, [args] )), so a handler
 * knows which row, which value or which fixed payload it was called for.
 *
 * @keywords argument parameter payload event data fixed value eventArg
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_167.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_167", class {
  mv_value = "";

  viewDisplay(c) {

    const view = ViewBuilder.factory()
        .ele("View", "mvc")
            .a("displayBlock", "true")
            .a("height", "100%")
            .a("xmlns", "sap.m")
            .a("xmlns:mvc", "sap.ui.core.mvc");
    const page = view.ele("Shell")
        .ele("Page")
            .a("title", "cap2UI5 - Event - Extra Arguments with the Event")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack());

    page.tag("MessageStrip")
        .a("text", "This sample shows how to pass extra arguments to an event via c.event( name, [args] ) - " +
                   "fixed values, model values, or client-side expressions - and read them in the backend.")
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    page.tag("Link")
        .a("text", "More information...")
        .a("target", "_blank")
        .a("href", "https://sdk.openui5.org/topic/b0fb4de7364f4bcbb053a99aa645affe");

    page.tag("Button")
        .a("press", c.event("EVENT_FIX_VAL", ["FIX_VAL"]))
        .a("text", "EVENT_FIX_VAL");

    page.tag("Input")
        .a("value", c.bind("mv_value"));
    page.tag("Button")
        .a("press", c.event("EVENT_MODEL_VALUE", ["$" + c.bind("mv_value")]))
        .a("text", "EVENT_MODEL_VALUE");

    page.tag("Button")
        .a("press", c.event("SOURCE_PROPERTY_TEXT", ["${$source>/text}"]))
        .a("text", "SOURCE_PROPERTY_TEXT");

    page.tag("Input")
        .a("description", "make an input and press enter - ")
        .a("submit", c.event("EVENT_PROPERTY_VALUE", ["${$parameters>/value}"]));

    page.tag("Button")
        .a("press", c.event("PARENT_PROPERTY_ID", ["$event.oSource.oParent.sId"]))
        .a("text", "PARENT_PROPERTY_ID");

    c.view(view);

  }

  main(c) {

    if (c.isFirstRun) {
      this.mv_value = "my value";
      this.viewDisplay(c);
    } else if (c.isDisplay) {
      this.viewDisplay(c);
    }

    switch (c.eventName) {
      case "EVENT_FIX_VAL":
      case "EVENT_MODEL_VALUE":
      case "SOURCE_PROPERTY_TEXT":
      case "EVENT_PROPERTY_VALUE":
      case "PARENT_PROPERTY_ID":
        c.messageBox(`backend event: ${c.eventArg(1)}`);
        break;
    }

  }
});
