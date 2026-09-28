// @keywords link href default action check_prevent_default
// @summary A Link whose default browser action is suppressed (check_prevent_default), so the app handles the click instead of the href.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/frontend
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_472.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_472", class {

  block_navigation = false;
  last_press = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.block_navigation = true;
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    switch (this.client.get_event()) {

      case "LINK_PRESS":

        if (this.block_navigation === true) {
          this.last_press = "Link pressed - the browser did NOT follow the href, the backend decides what happens.";
        } else {
          this.last_press = "Link pressed - the href was followed by the browser as usual.";
        }
        break;

      case "TOGGLE":
        // the flag is part of the event registration, so the view has to be
        // rebuilt for the change to reach the frontend
        this.view_display();
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
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Event - Link with preventDefault" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "A sap.m.Link normally follows its href when pressed. Registered with " +
                   "s_ctrl-check_prevent_default the event cancels that built-in default " +
                   "(oEvent.preventDefault()) before the roundtrip - the event still reaches the " +
                   "backend, so the app decides what happens instead. Flip the switch to compare." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const form = page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Link with a cancelled default" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" });

    form.tag("Label")
        .a({ n: "text", v: "Cancel the browser navigation" })
        .tag("Switch")
            .a({ n: "state",  v: this.client._bind("block_navigation") })
            .a({ n: "change", v: this.client._event("TOGGLE") })
        .tag("Label")
            .a({ n: "text", v: "Link" })
        .tag("Link")
            .a({ n: "text",   v: "Open abap2ui5.org" })
            .a({ n: "target", v: "_blank" })
            .a({ n: "href",   v: "https://abap2ui5.org" })
            .a({ n: "press",  v: this.client._event({
                val:    "LINK_PRESS",
                s_ctrl: { check_prevent_default: this.block_navigation } }) })
        .tag("Label")
            .a({ n: "text", v: "Result" })
        .tag("Text")
            .a({ n: "text", v: this.client._bind("last_press") });

    this.client.view_display(view.stringify());

  }
});
