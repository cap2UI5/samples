/**
 * Navigation - Data Input App (called by Z2UI5_CL_SMP_APP_488)
 *
 * Returns to its caller with c.navBack( { event, data } ) - handing back an
 * event name and the entered data without knowing which app called it (no
 * c.prevApp). A hidden helper, never listed on its own in the overview.
 *
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_489.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_489", class {
  s_result = { product: "", quantity: "" };

  main(c) {

    if (c.isFirstRun) {

      this.s_result = { product: "Notebook Basic 15", quantity: "2" };

      this.viewDisplay(c);

    } else if (c.isDisplay) {
      this.viewDisplay(c);

    } else if (c.eventName === "CONFIRM") {
      c.navBack({ event: "DATA_CONFIRMED", data: this.s_result });

    } else if (c.eventName === "CANCEL") {
      c.navBack({ event: "DATA_CANCELLED" });
    }

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
            .a("title", "cap2UI5 - Navigation - Data Input App")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack());

    page.tag("MessageStrip")
        .a("text", "Change the data and return: 'confirm' leaves with event DATA_CONFIRMED plus the " +
                   "entered data, 'cancel' leaves with event DATA_CANCELLED and no data. " +
                   "The nav-back button of the page leaves without an event.")
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    const form = page.ele("Grid", "layout")
        .a("defaultSpan", "L6 M12 S12")
        .ele("content", "layout")
            .ele("SimpleForm", "form")
                .a("title", "Data returned to the caller")
                .a("editable", true)
                .ele("content", "form");

    form.tag("Label")
        .a("text", "Product");
    form.tag("Input")
        .a("value", c.bind("s_result.product"));

    form.tag("Label")
        .a("text", "Quantity");
    form.tag("Input")
        .a("value", c.bind("s_result.quantity"));

    form.tag("Label")
        .a("text", "Return to the caller");
    form.tag("Button")
        .a("press", c.event("CONFIRM"))
        .a("text", "confirm (event + data)")
        .a("type", "Emphasized");
    form.tag("Button")
        .a("press", c.event("CANCEL"))
        .a("text", "cancel (event only)");

    c.view(view);

  }
});
