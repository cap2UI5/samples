/**
 * Navigation - Return Data and Events to the Caller
 *
 * The way back carries data: the called app returns an event name and a
 * payload (data) that the caller reads as c.eventData.
 *
 * Calls a second app (Z2UI5_CL_SMP_APP_489) with c.navTo( ). The called app
 * comes back with c.navBack( { event, data } ), handing an event name and a
 * data payload to its caller without knowing who called it. On return this
 * app enters main( ) with c.isDisplay and reads both: the event name from
 * c.eventName, the payload from c.eventData.
 *
 * @keywords navBack data eventData result return event payload
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_488.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_488", class {
  s_result = { product: "", quantity: "" };
  returned_event = "";

  main(c) {

    if (c.isFirstRun) {
      this.viewDisplay(c);

    } else if (c.isDisplay) {
      this.onNavigation(c);

    } else if (c.eventName === "CALL_APP") {
      c.navTo("Z2UI5_CL_SMP_APP_489");
    }

  }

  onNavigation(c) {

    this.returned_event = c.eventName;

    switch (this.returned_event) {

      case "DATA_CONFIRMED":

        // the payload handed over by navBack( { data } ) arrives typed, as
        // plain values - the receiver decides what to do with it
        if (c.eventData) {

          this.s_result = c.eventData;
          c.messageToast(`Returned event ${this.returned_event}, ` +
                         `product ${this.s_result.product}, quantity ${this.s_result.quantity}`);

        }
        break;

      case "DATA_CANCELLED":

        this.s_result = { product: "", quantity: "" };
        c.messageToast("Returned event DATA_CANCELLED, no data passed");
        break;

    }

    this.viewDisplay(c);

  }

  viewDisplay(c) {

    const view = ViewBuilder.factory()
        .ele("View", "mvc")
            .a("displayBlock", "true")
            .a("height", "100%")
            .a("xmlns", "sap.m")
            .a("xmlns:mvc", "sap.ui.core.mvc")
            .a("xmlns:form", "sap.ui.layout.form")
            .a("xmlns:layout", "sap.ui.layout");
    const page = view.ele("Shell")
        .ele("Page")
            .a("title", "cap2UI5 - Navigation - Return Data and Events to the Caller")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack());

    page.tag("MessageStrip")
        .a("text", "Calls a second app that returns via c.navBack( ) with an event and a data payload. " +
                   "On return this app reads both - c.eventName and c.eventData - in its c.isDisplay " +
                   "branch and shows them below.")
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    const form = page.ele("Grid", "layout")
        .a("defaultSpan", "L6 M12 S12")
        .ele("content", "layout")
            .ele("SimpleForm", "form")
                .a("title", "Result returned by the called app")
                .a("editable", true)
                .ele("content", "form");

    form.tag("Label")
        .a("text", "Open the input app");
    form.tag("Button")
        .a("press", c.event("CALL_APP"))
        .a("text", "call app (c.navTo)")
        .a("type", "Emphasized");

    form.tag("Label")
        .a("text", "Returned event");
    form.tag("Input")
        .a("enabled", false)
        .a("value", c.bind("returned_event"));

    form.tag("Label")
        .a("text", "Returned product");
    form.tag("Input")
        .a("enabled", false)
        .a("value", c.bind("s_result.product"));

    form.tag("Label")
        .a("text", "Returned quantity");
    form.tag("Input")
        .a("enabled", false)
        .a("value", c.bind("s_result.quantity"));

    c.view(view);

  }
});
