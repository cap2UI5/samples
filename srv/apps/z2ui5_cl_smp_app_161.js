// @keywords nested stack popup in popup second dialog
// @summary A dialog opened from inside a dialog, and what closing the inner one does to the stack.
// @docs https://abap2ui5.github.io/docs/cookbook/popup_popover/popup
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_161.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_161", class {

  simple_popup1() {

    const popup = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "FragmentDefinition", ns: "core" })
            .a({ n: "xmlns",      v: "sap.m" })
            .a({ n: "xmlns:core", v: "sap.ui.core" });

    const dialog = popup.ele("Dialog")
        .a({ n: "afterClose", v: this.client._event("BTN_OK_1ND") })
        .ele("content");

    dialog.tag("Button")
        .a({ n: "press", v: this.client._event("GOTO_2ND") })
        .a({ n: "text",  v: "Open 2nd popup" });

    dialog.end()
        .ele("buttons")
            .tag("Button")
                .a({ n: "press", v: this.client._event("BTN_OK_1ND") })
                .a({ n: "text",  v: "OK" })
                .a({ n: "type",  v: "Emphasized" });

    this.client.popup_display(popup.stringify());

  }

  simple_popup2() {

    const popup = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "FragmentDefinition", ns: "core" })
            .a({ n: "xmlns",      v: "sap.m" })
            .a({ n: "xmlns:core", v: "sap.ui.core" });

    const dialog = popup.ele("Dialog")
        .a({ n: "afterClose", v: this.client._event("BTN_OK_2ND") })
        .ele("content");

    dialog.tag("Label")
        .a({ n: "text", v: "this is a second popup" });

    dialog.end()
        .ele("buttons")
            .tag("Button")
                .a({ n: "press", v: this.client._event("BTN_OK_2ND") })
                .a({ n: "text",  v: "GOTO 1ST POPUP" })
                .a({ n: "type",  v: "Emphasized" });

    this.client.popup_display(popup.stringify());

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "cap2UI5 - Popup - Dialog inside a Dialog" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "This sample opens a popup from a button and then chains to a second popup " +
                               "from within the first one." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.tag("Button")
        .a({ n: "press", v: this.client._event("POPUP") })
        .a({ n: "text",  v: "Open Popup..." });

    this.client.view_display(view.stringify());

  }

  on_event() {

    switch (this.client.get_event()) {
      case "GOTO_2ND":
        this.simple_popup2();
        break;

      case "BTN_OK_2ND":
        this.client.popup_destroy();
        this.simple_popup1();
        break;

      case "BTN_OK_1ND":
        this.client.popup_destroy();
        break;

      case "POPUP":
        this.simple_popup1();
        break;
    }

  }

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
      return;
    }
    this.on_event();

  }

});
