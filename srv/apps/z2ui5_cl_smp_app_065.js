// @keywords nest_view_display rerender model refresh sub view
// @summary A nested view: nest_view_display renders a second view inside the first, and shows which model refresh reaches it.
// @docs https://abap2ui5.github.io/docs/cookbook/view/nested_views
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_065.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_065", class {

  mv_input_main = "";
  mv_input_nest = "";

  mv_count = 0;

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    switch (this.client.get_event()) {
      case "TEST":
        this.client.message_box_display(`input ${this.mv_input_nest}`);
        break;
      case "ALL":
        this.view_display();
        this.nest_view_display();
        break;
      case "MAIN":
        this.view_display();
        break;
      case "NEST":
        this.nest_view_display();
        break;
      case "NEST_MODEL":
        // change only a nest-bound field, without re-rendering the nested XML.
        // The main and nested views share one model and that model is pushed
        // with every response, so the nested view picks the change up too.
        // Press "Rerender only nested view" first so the nested view exists.
        this.mv_count      = this.mv_count + 1;
        this.mv_input_nest = `nest model updated #${this.mv_count}`;
        break;
    }

  }

  view_display() {

    const lo_view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    const page = lo_view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Nested View - Basic Example (nest_view_display)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() })
            .a({ n: "id",             v: "test" });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "A main view with a nested view inside: the buttons re-render everything, only the " +
                   "main view, only the nested view, or refresh just the nested view's model." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("content")
        .tag("Button")
            .a({ n: "press", v: this.client._event("ALL") })
            .a({ n: "text",  v: "Rerender all" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("MAIN") })
            .a({ n: "text",  v: "Rerender Main without nest" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("NEST") })
            .a({ n: "text",  v: "Rerender only nested view" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("NEST_MODEL") })
            .a({ n: "text",  v: "Update only nested MODEL (no re-render)" })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("mv_input_main") });

    this.client.view_display(lo_view.stringify());

  }

  nest_view_display() {

    const lo_view_nested = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .ele("Page")
                .a({ n: "title", v: "Nested View" })
                .tag("Button")
                    .a({ n: "press", v: this.client._event("TEST") })
                    .a({ n: "text",  v: "event" })
                .tag("Input")
                    .a({ n: "value", v: this.client._bind("mv_input_nest") });

    this.client.nest_view_display({ val: lo_view_nested.stringify(), id: "test", method_insert: "addContent", method_destroy: "removeAllContent" });

  }
});
