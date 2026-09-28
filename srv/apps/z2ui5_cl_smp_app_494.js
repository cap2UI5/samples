/**
 * Basics II - Data Binding: Input and Button
 *
 * Binds a field of the class to an Input with c.bind( ), so what the user types
 * is in the field on the next roundtrip - a Text shows it back and a MessageBox
 * confirms the roundtrip.
 *
 * @keywords binding bind model field value input button roundtrip messagebox
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_494.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

const INFO =
  "c.bind('name') connects the field NAME with the input below. Type a name and leave the " +
  "field: the text next to it changes without any backend code, because both are bound to the " +
  "same field. Press Greet and the backend reads NAME - already filled in, no event argument " +
  "needed -, writes GREETING back into the view and confirms the roundtrip with a MessageBox.";

defineApp("Z2UI5_CL_SMP_APP_494", class {
  name = "";
  greeting = "";

  main(c) {
    if (c.isFirstRun) {
      this.name = "World";
      this.viewDisplay(c);
    } else if (c.isDisplay) {
      this.viewDisplay(c);
    } else if (c.eventName === "GREET") {
      this.greeting = `Hello ${this.name}!`;
      c.messageBox(`Roundtrip done: the backend read NAME = '${this.name}' and wrote GREETING back into the view.`);
    }
  }

  viewDisplay(c) {

    const view = ViewBuilder.factory()
        .ele("View", "mvc")
            .a("displayBlock", "true")
            .a("height", "100%")
            .a("xmlns", "sap.m")
            .a("xmlns:mvc", "sap.ui.core.mvc")
            .a("xmlns:form", "sap.ui.layout.form");
    const page = view.ele("Shell")
        .ele("Page")
            .a("title", "cap2UI5 - Basics II - Data Binding: Input and Button")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack());

    page.tag("MessageStrip")
        .a("text", INFO)
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    page.ele("SimpleForm", "form")
        .a("title", "Data Binding")
        .a("editable", true)
        .ele("content", "form")
            .tag("Label")
                .a("text", "your name")
            .tag("Input")
                .a("value", c.bind("name"))
            .tag("Label")
                .a("text", "bound to the same field")
            .tag("Text")
                .a("text", c.bind("name"))
            .tag("Label")
                .a("text", "written by the backend")
            .tag("Text")
                .a("text", c.bind("greeting"))
            .tag("Button")
                .a("press", c.event("GREET"))
                .a("text", "Greet");
    c.view(view);

  }
});
