// @keywords nested view destroy nest_view_destroy nest2_view_destroy slot scope cs_view nested nested2 control_by_id focus
// @summary Two nested views built and torn down on demand, and a frontend action aimed at one of them by its slot - the view parameter of follow_up_action.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_510.clas.abap
//
// Two containers on the main page, one nested view each. nest_view_display
// puts a view INTO a container, nest_view_destroy takes it out again and
// leaves the container - the same for the second slot with nest2_*.
//
// A control_by_id action resolves an id across every open view by default
// (cs_view-main). The view parameter of follow_up_action scopes the lookup
// to ONE slot - cs_view-nested or cs_view-nested2 - so the focus is looked
// for in the view the app meant and nowhere else: a slot that is not open
// answers with nothing instead of the first match somewhere else.
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_510", class {

  input_nest  = "";
  input_nest2 = "";
  status      = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.status = "no nested view yet";
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    switch (this.client.get_event()) {

      case "NEST_SHOW":
        this.nest_display(z2ui5_if_client.cs_view.nested);
        this.status = "nested view 1 rendered into box_nest";
        break;

      case "NEST_DESTROY":
        // the view goes, the container stays - and the bound input keeps
        // its value in the class, so a new display brings it back
        this.client.nest_view_destroy();
        this.status = "nested view 1 destroyed - box_nest is empty again";
        break;

      case "NEST2_SHOW":
        this.nest_display(z2ui5_if_client.cs_view.nested2);
        this.status = "nested view 2 rendered into box_nest2";
        break;

      case "NEST2_DESTROY":
        this.client.nest2_view_destroy();
        this.status = "nested view 2 destroyed - box_nest2 is empty again";
        break;

      case "FOCUS_NEST":
        // the slot decides where the lookup happens: cs_view-nested is the
        // first nested view and nothing else. Without the view parameter
        // the id would be searched across every open view
        this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_by_id,
                                  view:  z2ui5_if_client.cs_view.nested,
                                  t_arg: [ "inp_nest", "focus" ] });
        this.status = "focus sent to id inp_nest, scoped to cs_view-nested";
        break;

      case "FOCUS_NEST2":
        this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_by_id,
                                  view:  z2ui5_if_client.cs_view.nested2,
                                  t_arg: [ "inp_nest2", "focus" ] });
        this.status = "focus sent to id inp_nest2, scoped to cs_view-nested2";
        break;

    }

  }

  nest_display(slot) {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    const panel = view.ele("Panel")
        .a({ n: "headerText", t: `nested view in slot ${slot}` })
        .a({ n: "class",      v: "sapUiSmallMarginTop" });

    if (slot === z2ui5_if_client.cs_view.nested) {

      panel.tag("Input")
          .a({ n: "id",          v: "inp_nest" })
          .a({ n: "placeholder", v: "id inp_nest, slot NEST" })
          .a({ n: "value",       v: this.client._bind("input_nest") });

      this.client.nest_view_display({ val:            view.stringify(),
                                 id:             "box_nest",
                                 method_insert:  "addItem",
                                 method_destroy: "removeAllItems" });

    } else {

      panel.tag("Input")
          .a({ n: "id",          v: "inp_nest2" })
          .a({ n: "placeholder", v: "id inp_nest2, slot NEST2" })
          .a({ n: "value",       v: this.client._bind("input_nest2") });

      this.client.nest2_view_display({ val:            view.stringify(),
                                  id:             "box_nest2",
                                  method_insert:  "addItem",
                                  method_destroy: "removeAllItems" });

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
            .a({ n: "title",          v: "abap2UI5 - Nested View - Destroy and Target a Slot" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Show and destroy the two nested views, then send the focus into one of them: the " +
                   "view parameter of follow_up_action decides which slot the id lookup is scoped to - " +
                   "a slot that is not open finds nothing." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("HBox")
        .a({ n: "wrap",  v: "Wrap" })
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Button")
            .a({ n: "text",  v: "show nested view 1" })
            .a({ n: "press", v: this.client._event("NEST_SHOW") })
        .tag("Button")
            .a({ n: "text",  v: "destroy nested view 1" })
            .a({ n: "press", v: this.client._event("NEST_DESTROY") })
        .tag("Button")
            .a({ n: "text",  v: "focus the input in slot nested" })
            .a({ n: "press", v: this.client._event("FOCUS_NEST") })
        .tag("ToolbarSpacer")
            .a({ n: "width", v: "1rem" })
        .tag("Button")
            .a({ n: "text",  v: "show nested view 2" })
            .a({ n: "press", v: this.client._event("NEST2_SHOW") })
        .tag("Button")
            .a({ n: "text",  v: "destroy nested view 2" })
            .a({ n: "press", v: this.client._event("NEST2_DESTROY") })
        .tag("Button")
            .a({ n: "text",  v: "focus the input in slot nested2" })
            .a({ n: "press", v: this.client._event("FOCUS_NEST2") });

    page.tag("MessageStrip")
        .a({ n: "text",     v: this.client._bind("status") })
        .a({ n: "type",     v: "Success" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // the two containers the nested views are inserted into - a VBox each,
    // addItem inserts, removeAllItems clears before a repeated display
    page.ele("HBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("VBox")
            .a({ n: "id",    v: "box_nest" })
            .a({ n: "width", v: "20rem" })
            .a({ n: "class", v: "sapUiSmallMarginEnd" })
        .tag("VBox")
            .a({ n: "id",    v: "box_nest2" })
            .a({ n: "width", v: "20rem" });

    this.client.view_display(view.stringify());

  }
});
