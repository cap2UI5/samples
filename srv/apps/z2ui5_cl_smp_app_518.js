// @keywords icon font registerfont iconpool tnt collection glyph missing control_global
// @summary Registers the sap.tnt icon collection with IconPool so a sap-icon://SAP-icons-TNT/... URI resolves - without it the icon renders no glyph and logs nothing.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/frontend
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_518.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_518", class {

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.font_register();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }

  }

  font_register() {

    // A normal UI5 app does this in its Component's init. An abap2UI5 app has
    // no Component of its own, and IconPool is a module SINGLETON rather than
    // a control, so no other wire reaches it. t_arg is positional: the font
    // family and the font URI - a module path in every real use, resolved
    // through sap.ui.require.toUrl, so the registration survives a different
    // mount point.
    //
    // Issue it from the init branch: the collection is registered once per
    // session, so a repeat call costs nothing but says the wrong thing.
    this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_global,
                              t_arg: [ "ICON_POOL",
                                               "registerFont",
                                               "SAP-icons-TNT",
                                               "sap/tnt/themes/base/fonts/" ] });

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",   v: "sap.ui.core" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Control Behaviour - Register an Icon Font" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Only the default SAP-icons font is registered out of the box. A URI naming another " +
                   "collection renders NO GLYPH and logs nothing at all - an empty space where an icon should be is the " +
                   "whole symptom, which is what makes this one worth knowing." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Title")
            .a({ n: "text",  v: "From the default collection" })
            .a({ n: "level", v: "H3" })
        .tag({ n: "Icon", ns: "core" })
            .a({ n: "src",   v: "sap-icon://sap-ui5" })
            .a({ n: "size",  v: "2.5rem" })
            .a({ n: "class", v: "sapUiSmallMarginBottom" })
        .tag("Title")
            .a({ n: "text",  v: "From SAP-icons-TNT, registered above" })
            .a({ n: "level", v: "H3" })
        .tag({ n: "Icon", ns: "core" })
            .a({ n: "src",  v: "sap-icon://SAP-icons-TNT/application-service" })
            .a({ n: "size", v: "2.5rem" });

    this.client.view_display(view.stringify());

  }
});
