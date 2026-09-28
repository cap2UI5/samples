/**
 * Popup - Dialog inside a Dialog
 *
 * A dialog opened from inside a dialog, and what closing the inner one does to
 * the stack.
 *
 * @keywords nested stack popup in popup second dialog
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_161.clas.abap
 */
import { defineApp, ViewBuilder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_161", class {

  simplePopup1(c) {

    const popup = ViewBuilder.factory()
        .ele("FragmentDefinition", "core")
            .a("xmlns", "sap.m")
            .a("xmlns:core", "sap.ui.core");

    const dialog = popup.ele("Dialog")
        .a("afterClose", c.event("BTN_OK_1ND"))
        .ele("content");

    dialog.tag("Button")
        .a("press", c.event("GOTO_2ND"))
        .a("text", "Open 2nd popup");

    dialog.end()
        .ele("buttons")
            .tag("Button")
                .a("press", c.event("BTN_OK_1ND"))
                .a("text", "OK")
                .a("type", "Emphasized");

    c.popup(popup);

  }

  simplePopup2(c) {

    const popup = ViewBuilder.factory()
        .ele("FragmentDefinition", "core")
            .a("xmlns", "sap.m")
            .a("xmlns:core", "sap.ui.core");

    const dialog = popup.ele("Dialog")
        .a("afterClose", c.event("BTN_OK_2ND"))
        .ele("content");

    dialog.tag("Label")
        .a("text", "this is a second popup");

    dialog.end()
        .ele("buttons")
            .tag("Button")
                .a("press", c.event("BTN_OK_2ND"))
                .a("text", "GOTO 1ST POPUP")
                .a("type", "Emphasized");

    c.popup(popup);

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
            .a("title", "cap2UI5 - Popup - Dialog inside a Dialog")
            .a("showNavButton", c.canGoBack)
            .a("navButtonPress", c.eventNavBack());

    page.tag("MessageStrip")
        .a("text", "This sample opens a popup from a button and then chains to a second popup " +
                   "from within the first one.")
        .a("type", "Information")
        .a("showIcon", true)
        .a("class", "sapUiSmallMargin");

    page.tag("Button")
        .a("press", c.event("POPUP"))
        .a("text", "Open Popup...");

    c.view(view);

  }

  onEvent(c) {

    switch (c.eventName) {
      case "GOTO_2ND":
        this.simplePopup2(c);
        break;

      case "BTN_OK_2ND":
        c.popupClose();
        this.simplePopup1(c);
        break;

      case "BTN_OK_1ND":
        c.popupClose();
        break;

      case "POPUP":
        this.simplePopup1(c);
        break;
    }

  }

  main(c) {

    if (c.isDisplay) {
      this.viewDisplay(c);
      return;
    }
    this.onEvent(c);

  }
});
