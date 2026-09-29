// @keywords cursor enter tab next field form set_focus
// @summary Moves the cursor to the next Input when Enter is pressed - the fast entry a form needs.
// @docs https://abap2ui5.github.io/docs/cookbook/browser_interaction/focus
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_189.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_189", class {

  one   = "";
  two   = "";
  three = "";

  on_event() {

    switch (this.client.get_event()) {
      case "one_enter":
        this.client.follow_up_action({
            val:   z2ui5_if_client.cs_event.set_focus,
            t_arg: [ "IdTwo" ] });
        break;
      case "two_enter":
        this.client.follow_up_action({
            val:   z2ui5_if_client.cs_event.set_focus,
            t_arg: [ "IdThree" ] });
        break;
    }

  }

  view_display() {

    const page = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" })
            .ele("Shell")
                .ele("Page")
                    .a({ n: "title",          v: "abap2UI5 - Focus - Jump to the Next Input on Enter" })
                    .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
                    .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Pressing Enter in an input field jumps the cursor to the next one via the set_focus follow-up action." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Label")
                .a({ n: "text", v: "One (Press Enter)" })
            .tag("Input")
                .a({ n: "id",     v: "IdOne" })
                .a({ n: "value",  v: this.client._bind("one") })
                .a({ n: "submit", v: this.client._event("one_enter") })
            .tag("Label")
                .a({ n: "text", v: "Two" })
            .tag("Input")
                .a({ n: "id",     v: "IdTwo" })
                .a({ n: "value",  v: this.client._bind("two") })
                .a({ n: "submit", v: this.client._event("two_enter") })
            .tag("Label")
                .a({ n: "text", v: "Three" })
            .tag("Input")
                .a({ n: "id",    v: "IdThree" })
                .a({ n: "value", v: this.client._bind("three") });

    this.client.view_display(page.stringify());

  }

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.view_display();
      client.follow_up_action({
          val:   z2ui5_if_client.cs_event.set_focus,
          t_arg: [ "IdOne" ] });

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }
});
