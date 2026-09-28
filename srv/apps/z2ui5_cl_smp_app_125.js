/**
 * Browser - Set the Tab Title (A)
 *
 * Sets the browser tab title from the app, so a bookmarked or duplicated window
 * says which app it holds.
 *
 * @keywords document.title tab caption headline set_title followUpAction
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_125.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_125", class {
  title = "my title";

  main(c) {

    if (c.isDisplay) {

      const view = ViewBuilder.factory()
          .ele("View", "mvc")
              .a("displayBlock", "true")
              .a("height", "100%")
              .a("xmlns", "sap.m")
              .a("xmlns:mvc", "sap.ui.core.mvc")
              .a("xmlns:form", "sap.ui.layout.form");
      const page = view.ele("Shell")
          .ele("Page")
              .a("title", "cap2UI5 - Browser - Set the Tab Title")
              .a("showNavButton", c.canGoBack)
              .a("navButtonPress", c.eventNavBack());

      page.tag("MessageStrip")
          .a("text", "Enter a title and press the button to run the set_title front-end action, which updates " +
                     "the browser tab title (document.title) without reloading the page.")
          .a("type", "Information")
          .a("showIcon", true)
          .a("class", "sapUiSmallMargin");

      page.ele("SimpleForm", "form")
          .a("title", "Form Title")
          .a("editable", true)
          .ele("content", "form")
              .tag("Label")
                  .a("text", "title")
              .tag("Input")
                  .a("value", c.bind("title"))
              .tag("Button")
                  .a("press", c.event("SET_TITLE"))
                  .a("text", "Set Title");
      c.view(view);

    } else if (c.eventName === "SET_TITLE") {

      c.followUpAction("set_title", [this.title]);

    }

  }
});
