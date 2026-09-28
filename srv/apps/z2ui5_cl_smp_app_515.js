// @keywords busy indicator global control_global show hide blocking wait spinner long running
// @summary Shows and hides the global BusyIndicator from ABAP through control_global - the singleton has no id, so a global target is the only wire that reaches it.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/frontend
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_515.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_515", class {

  status = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.status = "Idle - nothing running.";
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  busy_call({ method, arg = "" } = {}) {

    // sap.ui.core.BusyIndicator renders nothing of its own and has no id, so
    // control_by_id cannot address it - control_global is the only wire that
    // reaches a singleton like this one. t_arg is positional: the object, the
    // method, then its arguments. show( ) takes the delay in milliseconds
    // before the spinner appears; hide( ) takes none.
    this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_global,
                              t_arg: (arg === "" ? [ "BUSY_INDICATOR", method ]
                                              : [ "BUSY_INDICATOR", method, arg ]) });

  }

  on_event() {

    switch (this.client.get_event()) {

      case "START":
        // The indicator blocks the whole screen, so nothing the user does can
        // take it away again - something in this response has to. A client
        // timer is what fills the gap here; a real app would hide it in the
        // handler of whatever it was waiting for.
        this.status = "Running - the BusyIndicator is up, the timer takes it away.";
        this.busy_call({ method: "show",
                   arg:    "0" });
        this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.start_timer,
                                  t_arg: [ "FINISHED", "2500" ] });
        break;

      case "FINISHED":
        this.status = "Done - hide( ) was called from the timer's handler.";
        this.busy_call({ method: "hide" });
        break;

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
            .a({ n: "title",          v: "abap2UI5 - Control Behaviour - The Global Busy Indicator" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "abap2UI5 busies the screen for its own roundtrips already. This is the indicator an app " +
                   "drives itself, for a wait the framework knows nothing about - the eight whitelisted global objects are " +
                   "reached the same way, by name instead of by id." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("START") })
            .a({ n: "text",  v: "Show it for 2.5 seconds" })
            .a({ n: "icon",  v: "sap-icon://busy" })
            .a({ n: "type",  v: "Emphasized" })
        .tag("ObjectStatus")
            .a({ n: "title", v: "Status" })
            .a({ n: "text",  v: this.client._bind("status") })
            .a({ n: "class", v: "sapUiSmallMarginTop" });

    this.client.view_display(view.stringify());

  }
});
