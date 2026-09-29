// @keywords inputmode soft keyboard numeric keypad barcode scanner mobile inputext bound property
// @summary Sets the HTML inputmode of an Input through the bound inputMode property of z2ui5.cc.InputExt - the keyboard layout is model data, not an action.
// @docs https://abap2ui5.github.io/docs/cookbook/browser_interaction/soft_keyboard
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_516.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_516", class {

  mode  = "";
  value = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.mode = "numeric";
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    // The mode is an ordinary bound attribute, so switching the keyboard is a
    // model update and nothing else - no follow-up action travels, and there
    // is no ordering to get right between the action and the next render.
    switch (this.client.get_event()) {
      case "NUMERIC":
        this.mode = "numeric";
        break;
      case "DECIMAL":
        this.mode = "decimal";
        break;
      case "TEL":
        this.mode = "tel";
        break;
      case "NONE":
        this.mode = "none";
        break;
      case "OFF":
        // empty leaves the field exactly as sap.m.Input rendered it
        this.mode = "";
        break;
    }

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:z2ui5",  v: "z2ui5.cc" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Browser - Keyboard Layout of an Input (inputmode)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "inputmode asks the on-screen keyboard for a layout without changing what the field IS - " +
                   "numeric gives a digit pad on a field that still takes any text, and none keeps the keyboard DOWN while " +
                   "the field goes on taking input, which is what a barcode scanner needs. Visible on a phone or tablet." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag({ n: "InputExt", ns: "z2ui5" })
            .a({ n: "value",       v: this.client._bind("value") })
            .a({ n: "inputMode",   v: this.client._bind("mode") })
            .a({ n: "placeholder", v: "tap here on a touch device" })
            .a({ n: "width",       v: "20rem" })
        .tag("ObjectStatus")
            .a({ n: "title", v: "inputMode" })
            .a({ n: "text",  v: this.client._bind("mode") })
            .a({ n: "class", v: "sapUiSmallMarginTop sapUiSmallMarginBottom" });

    page.ele("HBox")
        .a({ n: "class", v: "sapUiSmallMarginBegin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("NUMERIC") })
            .a({ n: "text",  v: "numeric" })
            .a({ n: "class", v: "sapUiTinyMarginEnd" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("DECIMAL") })
            .a({ n: "text",  v: "decimal" })
            .a({ n: "class", v: "sapUiTinyMarginEnd" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("TEL") })
            .a({ n: "text",  v: "tel" })
            .a({ n: "class", v: "sapUiTinyMarginEnd" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("NONE") })
            .a({ n: "text",  v: "none - no keyboard" })
            .a({ n: "class", v: "sapUiTinyMarginEnd" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("OFF") })
            .a({ n: "text",  v: "plain sap.m.Input" });

    this.client.view_display(view.stringify());

  }
});
