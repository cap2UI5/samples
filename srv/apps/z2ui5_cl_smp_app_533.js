// @origin abap2UI5/samples src/z2ui5_cl_smp_app_533.clas.abap
// An app with screens of its own, called by z2ui5_cl_smp_app_531: Next and
// Previous rebuild ITS view, no other app is involved - so nothing tells the
// framework which way the screen moves. Next is forward by default; Previous
// says it with view_display( transition_back = abap_true ) and plays the
// step being left out in reverse. Done leaves the app with nav_app_leave( ),
// reversed too. This app is a hidden helper (never listed on its own in the
// overview).
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

const steps = 3;

defineApp("Z2UI5_CL_SMP_APP_533", class {

  step   = 1;

  main(client) {

    this.client = client;

    if (client.check_on_navigated()) {
      this.view_display();

    } else if (client.check_on_event("NEXT")) {

      this.step = this.step + 1;
      this.view_display();

    } else if (client.check_on_event("PREVIOUS")) {

      this.step = this.step - 1;
      this.view_display(true);

    } else if (client.check_on_event("DONE")) {
      client.nav_app_leave();
    }

  }

  view_display(back) {

    const color = (this.step === 1 ? "#0a6ed1"
                                 : this.step === 2 ? "#e9730c"
                                 : "#107e3e");

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",   v: "sap.ui.core" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          t: `abap2UI5 - Wizard - Step ${this.step} of ${steps}` })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "id",       v: "step" })
        .a({ n: "text",     t: `Step ${this.step} of ${steps} - the same app, a new view each time. Next moves forward, ` +
                                 `Previous says it goes back: view_display( transition_back = abap_true ).` })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const content = page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" });

    content.tag({ n: "Icon", ns: "core" })
        .a({ n: "src",   v: "sap-icon://step" })
        .a({ n: "size",  v: "6rem" })
        .a({ n: "color", t: color })
        .a({ n: "class", v: "sapUiMediumMarginTopBottom" });

    content.tag("Button")
        .a({ n: "id",      v: "previous" })
        .a({ n: "text",    v: "Previous - view_display( transition_back = abap_true )" })
        .a({ n: "icon",    v: "sap-icon://navigation-left-arrow" })
        .a({ n: "enabled", b: (this.step > 1) })
        .a({ n: "class",   v: "sapUiTinyMarginBottom" })
        .a({ n: "press",   v: this.client._event("PREVIOUS") });
    content.tag("Button")
        .a({ n: "id",      v: "next" })
        .a({ n: "text",    v: "Next - view_display( transition = slide )" })
        .a({ n: "icon",    v: "sap-icon://navigation-right-arrow" })
        .a({ n: "enabled", b: (this.step < steps) })
        .a({ n: "type",    v: "Emphasized" })
        .a({ n: "class",   v: "sapUiTinyMarginBottom" })
        .a({ n: "press",   v: this.client._event("NEXT") });
    content.tag("Button")
        .a({ n: "id",    v: "done" })
        .a({ n: "text",  v: "Done - nav_app_leave( ): back to the caller" })
        .a({ n: "icon",  v: "sap-icon://accept" })
        .a({ n: "press", v: this.client._event("DONE") });

    this.client.view_display({ val: view.stringify(), transition: this.client.cs_transition.slide, transition_back: back });

  }
});
