// @keywords placement anchor button confirm cancel popover_display
// @summary A Popover anchored to the control that opened it, with the placements to choose from and a confirm/cancel footer.
// @docs https://abap2ui5.github.io/docs/cookbook/popup_popover/popover
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_026.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_026", class {

  placement = "";
  input     = "";

  main(client) {

    this.client = client;

    if (client.check_on_init()) {

      this.placement = "Left";
      this.input     = "abcd";
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("POPOVER")) {
      this.popover_display("TEST");

    } else if (client.check_on_event("BUTTON_CONFIRM")) {

      client.message_toast_display(`confirm - input: ${this.input}`);
      client.popover_destroy();

    } else if (client.check_on_event("BUTTON_CANCEL")) {

      client.message_toast_display("cancel");
      client.popover_destroy();

    }

  }

  popover_display(id) {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "FragmentDefinition", ns: "core" })
            .a({ n: "xmlns",      v: "sap.m" })
            .a({ n: "xmlns:core", v: "sap.ui.core" });
    view.ele("Popover")
        .a({ n: "title",     v: "Popover Title" })
        .a({ n: "placement", t: this.placement })
        .ele("footer")
            .ele("OverflowToolbar")
                .tag("ToolbarSpacer")
                .tag("Button")
                    .a({ n: "press", v: this.client._event("BUTTON_CANCEL") })
                    .a({ n: "text",  v: "Cancel" })
                .tag("Button")
                    .a({ n: "press", v: this.client._event("BUTTON_CONFIRM") })
                    .a({ n: "text",  v: "Confirm" })
                    .a({ n: "type",  v: "Emphasized" })
            .end()
        .end()
        .tag("Text")
            .a({ n: "text", v: "make an input here:" })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("input") });

    this.client.popover_display({ xml: view.stringify(), by_id: id });

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
            .a({ n: "title",          v: "abap2UI5 - Popover - Basic Example with Placement" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Popover demo: choose a placement with the segmented button, then open a popover " +
                   "anchored to a control, with confirm and cancel actions." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Popover" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Title")
                .a({ n: "text", v: "Input" })
            .tag("Label")
                .a({ n: "text", v: "Link" })
            .tag("Link")
                .a({ n: "text",   v: "Documentation UI5 Popover Control" })
                .a({ n: "href",   v: "https://sdk.openui5.org/entity/sap.m.Popover" })
                .a({ n: "target", v: "_blank" })
            .tag("Label")
                .a({ n: "text", v: "placement" })
            .ele("SegmentedButton")
                .a({ n: "selectedKey", v: this.client._bind("placement") })
                .ele("items")
                    .tag("SegmentedButtonItem")
                        .a({ n: "icon", v: "sap-icon://add-favorite" })
                        .a({ n: "key",  v: "Left" })
                        .a({ n: "text", v: "Left" })
                    .tag("SegmentedButtonItem")
                        .a({ n: "icon", v: "sap-icon://accept" })
                        .a({ n: "key",  v: "Top" })
                        .a({ n: "text", v: "Top" })
                    .tag("SegmentedButtonItem")
                        .a({ n: "icon", v: "sap-icon://accept" })
                        .a({ n: "key",  v: "Bottom" })
                        .a({ n: "text", v: "Bottom" })
                    .tag("SegmentedButtonItem")
                        .a({ n: "icon", v: "sap-icon://attachment" })
                        .a({ n: "key",  v: "Right" })
                        .a({ n: "text", v: "Right" })
                .end()
            .end()
            .tag("Label")
                .a({ n: "text", v: "popover" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("POPOVER") })
                .a({ n: "text",  v: "show" })
                .a({ n: "id",    v: "TEST" });

    this.client.view_display(view.stringify());

  }
});
