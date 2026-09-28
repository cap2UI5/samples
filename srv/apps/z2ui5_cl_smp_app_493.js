// @keywords hello world smallest first app minimal start here template
// @summary The smallest app that runs: one class, one view_display( ), a Page with a title - the shape every other sample starts from.
// @docs https://abap2ui5.github.io/docs/get_started/hello_world https://abap2ui5.github.io/docs/cookbook/view/definition https://abap2ui5.github.io/docs/cookbook/expert_more/snippets https://abap2ui5.github.io/docs/tutorials/walkthrough/step-1
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_493.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_493", class {

  main(client) {

    if (client.check_on_navigated()) {

      const view = z2ui5_cl_ui5_view_builder.factory()
          .ele({ n: "View", ns: "mvc" })
              .a({ n: "displayBlock", v: "true" })
              .a({ n: "height",       v: "100%" })
              .a({ n: "xmlns",        v: "sap.m" })
              .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });
      const page = view.ele("Shell")
          .ele("Page")
              .a({ n: "title",          v: "cap2UI5 - Basics I - Hello World, the Smallest App" })
              .a({ n: "showNavButton",  b: client.check_app_prev_stack() })
              .a({ n: "navButtonPress", v: client._event_nav_app_leave() });

      page.tag("MessageStrip")
          .a({ n: "text",     v: "The whole app is what you see below: a class handed to defineApp( ), " +
                                 "one main( ) method, a view built as XML and handed to client.view_display( ). " +
                                 "cap2UI5 calls main( ) on every roundtrip - here only the display matters, " +
                                 "which is what check_on_navigated( ) asks: true on the first start and whenever " +
                                 "the app is shown again. Copy this file as the starting point for your own app." })
          .a({ n: "type",     v: "Information" })
          .a({ n: "showIcon", b: true })
          .a({ n: "class",    v: "sapUiSmallMargin" });

      page.tag("Title")
          .a({ n: "text",  v: "Hello World" })
          .a({ n: "class", v: "sapUiSmallMargin" })
          .a({ n: "level", v: "H2" });
      client.view_display(view.stringify());

    }

  }
});
