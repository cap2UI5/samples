// @keywords confirm warning error success information dialog action onclose message_box_display
// @summary Every MessageBox type - confirm, warning, error, success, information - and what a custom action button changes about the answer.
// @docs https://abap2ui5.github.io/docs/cookbook/translation_messages/message
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_382.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_382", class {

  title = "";
  message = "";
  details = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
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
                    .a({ n: "title",          v: "abap2UI5 - Message - MessageBox, Types and Custom Actions" })
                    .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
                    .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Open a MessageBox of each type, or a custom one with your own actions, and close it: " +
                   "onclose raises a backend event that carries the pressed button, and the toast shows it - " +
                   "OK or CANCEL for confirm, CLOSE for error, Approve or Reject for the custom box." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("headerContent")
        .tag("Link")
            .a({ n: "text",   v: "UI5 Demo Kit" })
            .a({ n: "target", v: "_blank" })
            .a({ n: "href",   v: "https://sdk.openui5.org/entity/sap.m.MessageBox/sample/sap.m.sample.MessageBox" });

    page.ele("Panel")
        .a({ n: "headerText", v: "Message Box Configuration" })
        .ele({ n: "SimpleForm", ns: "form" })
            .a({ n: "title",    v: "Settings" })
            .a({ n: "editable", b: true })
            .ele({ n: "content", ns: "form" })
                .tag("Label")
                    .a({ n: "text", v: "Title" })
                .tag("Input")
                    .a({ n: "value", v: this.client._bind("title") })
                .tag("Label")
                    .a({ n: "text", v: "Message" })
                .tag("Input")
                    .a({ n: "value", v: this.client._bind("message") })
                .tag("Label")
                    .a({ n: "text", v: "Details" })
                .tag("TextArea")
                    .a({ n: "value", v: this.client._bind("details") })
                    .a({ n: "rows",  v: "3" });

    page.ele("footer")
        .ele("OverflowToolbar")
            .tag("Text")
                .a({ n: "text", v: "Open Message Box:" })
            .tag("ToolbarSpacer")
            .tag("Button")
                .a({ n: "press", v: this.client._event("confirm") })
                .a({ n: "text",  v: "Confirm" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("information") })
                .a({ n: "text",  v: "Information" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("success") })
                .a({ n: "text",  v: "Success" })
                .a({ n: "type",  v: "Accept" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("warning") })
                .a({ n: "text",  v: "Warning" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("error") })
                .a({ n: "text",  v: "Error" })
                .a({ n: "type",  v: "Reject" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("CUSTOM") })
                .a({ n: "text",  v: "Custom" })
                .a({ n: "type",  v: "Emphasized" });

    this.client.view_display(page.stringify());

  }

  on_event() {

    // every box names BOX_CLOSED as its onclose event: the button the user
    // pressed comes back as the first event argument - the type's default
    // (OK, CANCEL, CLOSE) or one of the custom actions
    switch (this.client.get_event()) {
      case "BOX_CLOSED":
        this.client.message_toast_display(`Answer: ${this.client.get_event_arg()}`);
        break;
      case "CUSTOM":
        this.client.message_box_display({
            text:             this.message,
            title:            this.title,
            type:             "information",
            details:          this.details,
            actions:          [ "Approve", "Reject" ],
            emphasizedaction: "Approve",
            onclose:          "BOX_CLOSED" });
        break;
      default:
        this.client.message_box_display({
            text:    this.message,
            title:   this.title,
            type:    this.client.get_event(),
            details: this.details,
            onclose: "BOX_CLOSED" });
        break;
    }

  }

  on_init() {

    this.title   = "abap2UI5";
    this.message = "This is a message box.";
    this.details = "These are additional details about the message.";

  }
});
