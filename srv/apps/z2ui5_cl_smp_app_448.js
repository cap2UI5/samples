// @keywords panel collapse expand setexpanded control_by_id whitelisted
// @summary Expands a Panel by calling setExpanded on it by ID - a whitelisted control call, no roundtrip and no model behind it.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/frontend
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_448.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_448", class {

  // not bound - mirrors the panel state so the toggle can invert it; the
  // panel's expand event keeps it in step when the header is clicked
  expanded = false;

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
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
            .a({ n: "title",          v: "abap2UI5 - Control Behaviour - Expand a Panel by ID (setExpanded)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "The button toggles the panel via the whitelisted setExpanded method " +
                   "(follow_up_action with cs_event-control_by_id), client-side after render - no view rebuild." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("TOGGLE") })
            .a({ n: "text",  v: "Toggle panel" })
            .a({ n: "icon",  v: "sap-icon://expand-group" });

    page.ele("Panel")
        .a({ n: "expandable", b: true })
        .a({ n: "width",      v: "auto" })
        .a({ n: "id",         v: "demoPanel" })
        .a({ n: "class",      v: "sapUiSmallMargin" })
        .a({ n: "headerText", v: "Collapsible panel" })
        .a({ n: "expand",     v: this.client._event({ val: "PANEL_EXPAND", arg: "${$parameters>/expand}" }) })
        .tag("Text")
            .a({ n: "text", v: "Content of the panel - collapsed and expanded from the backend without a roundtrip payload." });

    this.client.view_display(view.stringify());

  }

  on_event() {

    switch (this.client.get_event()) {
      case "PANEL_EXPAND":
        // the user expanded or collapsed the panel by its own header - and
        // setExpanded fires this as well - so the mirror follows the panel
        this.expanded = (this.client.get_event_arg() === (true ? "X" : ""));
        break;
      case "TOGGLE":
        // invert the mirrored state and call the whitelisted setExpanded on
        // the panel - client-side, after the response renders, no rebuild.
        // t_arg is positional: id, method, params (the view defaults to
        // cs_view-main and can be omitted for a main-view control)
        this.expanded = (this.expanded === false);
        // Driving a property through control_by_id IS this sample; the plain
        // binding the rule recommends would be expanded = _bind( expanded ).
        this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_by_id,
                                  t_arg: [ "demoPanel",
                                                   "setExpanded",
                                                   (this.expanded ? "X" : "") ] });
        break;
    }

  }
});
