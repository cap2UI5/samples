// @keywords binding _bind model attribute value input button roundtrip messagebox serialize
// @summary Binds a class attribute to an Input with _bind( ), so what the user types is in the ABAP variable on the next roundtrip - a Text shows it back and a MessageBox confirms the roundtrip.
// @docs https://abap2ui5.github.io/docs/cookbook/model/binding https://abap2ui5.github.io/docs/tutorials/walkthrough/step-4
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_494.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_494", class {

  name     = "";
  greeting = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.name = "World";
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("GREET")) {
      this.greeting = `Hello ${this.name}!`;
      client.message_box_display(`Roundtrip done: the backend read NAME = '${this.name}' and wrote GREETING back into the view.`);
    }

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Basics II - Data Binding: Input and Button" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "client->_bind( name ) connects the public attribute NAME with the input " +
                   "below. Type a name and leave the field: the text " +
                   "next to it changes without any ABAP code, because both are bound to the " +
                   "same attribute. Press Greet and the backend reads NAME - already filled " +
                   "in, no event argument needed -, writes GREETING back into the view and " +
                   "confirms the roundtrip with a MessageBox." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Data Binding" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Label")
                .a({ n: "text", v: "your name" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("name") })
            .tag("Label")
                .a({ n: "text", v: "bound to the same attribute" })
            .tag("Text")
                .a({ n: "text", v: this.client._bind("name") })
            .tag("Label")
                .a({ n: "text", v: "written by the backend" })
            .tag("Text")
                .a({ n: "text", v: this.client._bind("greeting") })
            .tag("Button")
                .a({ n: "press", v: this.client._event("GREET") })
                .a({ n: "text",  v: "Greet" });
    this.client.view_display(view.stringify());

  }
});
