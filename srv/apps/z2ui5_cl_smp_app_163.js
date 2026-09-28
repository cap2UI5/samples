// @keywords menu menuitem popover button messagetoast require module
// @summary A Menu opened as a popover from a Button, whose items call a UI5 module loaded with core:require, so the click is answered in the frontend.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_163.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_163", class {

  on_event() {

    if (this.client.check_on_event("OPEN_MENU")) {
      this.view_menu();
    }

  }

  view_menu() {

    const menu_view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "FragmentDefinition", ns: "core" })
            .a({ n: "xmlns",      v: "sap.m" })
            .a({ n: "xmlns:core", v: "sap.ui.core" });

    menu_view.a({ n: "core:require", v: "{ MessageToast: 'sap/m/MessageToast' }" });

    // Every MenuItem below calls the core:require'd MessageToast in the
    // BROWSER through an expression binding - no roundtrip, which is the point
    // of this sample. binding-for-event is about a MODEL binding landing on an
    // event by accident; this is the deliberate other thing.
    menu_view.ele("Menu")
        .a({ n: "title", v: "Choose Your Action" })
        .tag("MenuItem")
            .a({ n: "press", v: "MessageToast.show('selected action is ' + ${$source>/text})" })
            .a({ n: "text",  v: "Accept" })
            .a({ n: "icon",  v: "sap-icon://accept" })
        .tag("MenuItem")
            .a({ n: "press", v: "MessageToast.show('selected action is ' + ${$source>/text})" })
            .a({ n: "text",  v: "Reject" })
            .a({ n: "icon",  v: "sap-icon://decline" })
        .tag("MenuItem")
            .a({ n: "press", v: "MessageToast.show('selected action is ' + ${$source>/text})" })
            .a({ n: "text",  v: "Email" })
            .a({ n: "icon",  v: "sap-icon://email" })
        .tag("MenuItem")
            .a({ n: "press", v: "MessageToast.show('selected action is ' + ${$source>/text})" })
            .a({ n: "text",  v: "Forward" })
            .a({ n: "icon",  v: "sap-icon://forward" })
        .tag("MenuItem")
            .a({ n: "press", v: "MessageToast.show('selected action is ' + ${$source>/text})" })
            .a({ n: "text",  v: "Delete" })
            .a({ n: "icon",  v: "sap-icon://delete" })
        .tag("MenuItem")
            .a({ n: "press", v: "MessageToast.show('selected action is ' + ${$source>/text})" })
            .a({ n: "text",  v: "Other" });

    this.client.popover_display({ xml: menu_view.stringify(), by_id: "menuButton" });

  }

  view_display() {

    let view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    view           = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Menu - Menu as Popover with core:require" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() })
            .a({ n: "id",             v: "page_main" });

    view.tag("MessageStrip")
        .a({ n: "text",     v: "This sample opens a Menu as a popover anchored to a button; choosing an " +
                   "item shows the selected action in a MessageToast." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const vbox = view.ele("VBox");

    vbox.tag("Button")
        .a({ n: "press", v: this.client._event("OPEN_MENU") })
        .a({ n: "text",  v: "Open Menu" })
        .a({ n: "id",    v: "menuButton" })
        .a({ n: "class", v: "sapUiSmallMargin" });

    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }
});
