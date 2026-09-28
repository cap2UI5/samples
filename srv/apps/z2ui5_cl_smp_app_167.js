// @keywords argument parameter payload event data fixed value
// @summary Sends extra arguments with an event (t_arg), so a handler knows which row, which value or which fixed payload it was called for.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/backend https://abap2ui5.github.io/docs/tutorials/walkthrough/step-6
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_167.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_167", class {

  mv_value = "";

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "cap2UI5 - Event - Extra Arguments with t_arg" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "This sample shows how to pass extra arguments to an event via t_arg - fixed " +
                               "values, model values, or client-side expressions - and read them in the backend." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.tag("Link")
        .a({ n: "text",   v: "More information..." })
        .a({ n: "target", v: "_blank" })
        .a({ n: "href",   v: "https://sdk.openui5.org/topic/b0fb4de7364f4bcbb053a99aa645affe" });

    page.tag("Button")
        .a({ n: "press", v: this.client._event({ val: "EVENT_FIX_VAL", arg: "FIX_VAL" }) })
        .a({ n: "text",  v: "EVENT_FIX_VAL" });

    page.tag("Input")
        .a({ n: "value", v: this.client._bind("mv_value") });
    page.tag("Button")
        .a({ n: "press", v: this.client._event({ val: "EVENT_MODEL_VALUE", arg: "$" + this.client._bind("mv_value") }) })
        .a({ n: "text",  v: "EVENT_MODEL_VALUE" });

    page.tag("Button")
        .a({ n: "press", v: this.client._event({ val: "SOURCE_PROPERTY_TEXT", arg: "${$source>/text}" }) })
        .a({ n: "text",  v: "SOURCE_PROPERTY_TEXT" });

    page.tag("Input")
        .a({ n: "description", v: "make an input and press enter - " })
        .a({ n: "submit",      v: this.client._event({ val: "EVENT_PROPERTY_VALUE", arg: "${$parameters>/value}" }) });

    page.tag("Button")
        .a({ n: "press", v: this.client._event({ val: "PARENT_PROPERTY_ID", arg: "$event.oSource.oParent.sId" }) })
        .a({ n: "text",  v: "PARENT_PROPERTY_ID" });

    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;

    if (client.check_on_init()) {
      this.mv_value = "my value";
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }

    switch (client.get_event()) {
      case "EVENT_FIX_VAL": case "EVENT_MODEL_VALUE": case "SOURCE_PROPERTY_TEXT": case "EVENT_PROPERTY_VALUE": case "PARENT_PROPERTY_ID":
        client.message_box_display(`backend event: ${client.get_event_arg()}`);
    }

  }
});
