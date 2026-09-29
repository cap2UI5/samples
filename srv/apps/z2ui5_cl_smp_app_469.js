// @origin abap2UI5/samples src/z2ui5_cl_smp_app_469.clas.abap
// Detail page shared by the two routing-mode demos - z2ui5_cl_smp_app_468
// (mode fresh) and z2ui5_cl_smp_app_480 (mode keep). It is reached via
// client->nav_app_call( ), which - when hash routing is on - pushes a new route
// history entry, so the browser Back button returns to the hub it came from.
// This app only shows what to do next; it is a hidden helper (never listed on
// its own in the overview).
//
// In mode keep the browser Forward button (or a reload/bookmark of the route)
// restores this app from its draft and enters main( ) via
// check_on_navigated( ) - the view must be rendered again there, or the
// browser keeps showing the hub it navigated away from.
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_469", class {

  main(client) {

    this.client = client;

    // also covers the first start, plus browser Forward / reload / a bookmark
    // restoring this app from its draft (routing mode keep) - the state
    // survived, only the view must be rendered again
    if (client.check_on_navigated()) {
      this.view_display();
    }

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
            .a({ n: "title",          v: "abap2UI5 - Navigation - Detail Page" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "You navigated here from a routing-mode hub via nav_app_call. Now press your " +
                   "BROWSER Back button and watch the hub: mode keep restores its state, mode fresh " +
                   "restarts it empty." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.tag("Button")
        .a({ n: "press", v: this.client._event_nav_app_leave() })
        .a({ n: "text",  v: "back (in-app)" })
        .a({ n: "icon",  v: "sap-icon://nav-back" })
        .a({ n: "class", v: "sapUiSmallMargin" });

    this.client.view_display(view.stringify());

  }
});
