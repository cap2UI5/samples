// @keywords cursor set_focus selection position textfield
// @summary Sets the focus into an Input and selects its text, so the next keystroke overwrites rather than appends.
// @docs https://abap2ui5.github.io/docs/cookbook/browser_interaction/focus
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_133.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_133", class {

  field_01 = "";
  field_02 = "";
  selstart = "";
  selend   = "";

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
            .a({ n: "title",          v: "abap2UI5 - Focus - Set Focus and Select Text in an Input" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Pressing a button runs the set_focus front-end action, which moves keyboard focus to the " +
                   "target input and selects the text between the given start and end positions." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Focus & Cursor" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Title")
                .a({ n: "text", v: "Input" })
            .tag("Label")
                .a({ n: "text", v: "Sel_Start" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("selstart") })
            .tag("Label")
                .a({ n: "text", v: "Sel_End" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("selend") })
            .tag("Label")
                .a({ n: "text", v: "field_01" })
            .tag("Input")
                .a({ n: "id",    v: "BUTTON01" })
                .a({ n: "value", v: this.client._bind("field_01") })
            .tag("Button")
                .a({ n: "press", v: this.client._event("BUTTON01") })
                .a({ n: "text",  v: "focus here" })
            .tag("Label")
                .a({ n: "text", v: "field_02" })
            .tag("Input")
                .a({ n: "id",    v: "BUTTON02" })
                .a({ n: "value", v: this.client._bind("field_02") })
            .tag("Button")
                .a({ n: "press", v: this.client._event("BUTTON02") })
                .a({ n: "text",  v: "focus here" });

    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.field_01 = "this is a text";
      this.field_02 = "this is another text";
      this.selstart = "3";
      this.selend   = "7";
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("BUTTON01") || client.check_on_event("BUTTON02")) {

      client.follow_up_action({
          val:   z2ui5_if_client.cs_event.set_focus,
          t_arg: [ client.get_event(), this.selstart, this.selend ] });
      client.message_toast_display(`focus changed`);
    }

  }
});
