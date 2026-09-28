// @keywords url policy link security validator relative allow deny
// @summary The URL policy of a MessagePopover: which links it will follow and which it refuses, and why the default is the strict one.
// @docs https://abap2ui5.github.io/docs/cookbook/translation_messages/message
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_474.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_474", class {

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

      case "OPEN_RELATIVE_ONLY":
        this.popover_open("RELATIVE_ONLY");
        break;

      case "OPEN_ALLOW_ALL":
        this.popover_open("ALLOW_ALL");
        break;

      case "OPEN_DENY_ALL":
        this.popover_open("DENY_ALL");
        break;

    }

  }

  popover_open(policy) {

    // setAsyncURLHandler takes a JS callback in a UI5 controller, which no
    // backend payload can carry - the frontend therefore takes the NAME of a
    // built-in policy and installs the matching validator itself:
    // RELATIVE_ONLY (only in-app links stay clickable), ALLOW_ALL, DENY_ALL
    //
    // The handler is live control state a rebuild destroys, and this method is
    // not on the display path - control-state-lost-on-rebuild is right about
    // both. It is still not a defect HERE: every open goes through this method,
    // so the validator is re-installed immediately before each openBy( ) below,
    // and there is no window in which the popover is visible without it. That
    // is the one thing the rule cannot see, so it is said here instead.
    // re-issued before every openBy
    this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_by_id,
                              t_arg: [ "msgPopover",
                                               "setAsyncURLHandler",
                                               policy ] });

    // ... and only then open it, anchored to the button that fired the event
    this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_by_id,
                              t_arg: [ "msgPopover",
                                               "openBy",
                                               this.client.get_event_arg() ] });

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
            .a({ n: "title",          v: "abap2UI5 - Message - MessagePopover URL Policy" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Each message below carries an in-app link and an external one. The policy " +
                   "applied when opening decides which of them the popover keeps clickable - " +
                   "RELATIVE_ONLY blocks everything that leaves the app, ALLOW_ALL keeps every " +
                   "link, DENY_ALL blocks all of them. The policy travels as data, the frontend " +
                   "installs the validator (setAsyncURLHandler)." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("dependents")
        .ele("MessagePopover")
            .a({ n: "id", v: "msgPopover" })
            .ele("MessageItem")
                .a({ n: "type",              v: "Error" })
                .a({ n: "title",             v: "Order cannot be released" })
                .a({ n: "description",       v: "Check the <a href=\"#/orders/4711\">order details</a> or the " +
                                    "<a href=\"https://abap2ui5.org\">documentation</a>." })
                .a({ n: "markupDescription", b: true })
            .end()
            .ele("MessageItem")
                .a({ n: "type",              v: "Warning" })
                .a({ n: "title",             v: "Delivery date in the past" })
                .a({ n: "description",       v: "Open the <a href=\"#/deliveries\">delivery list</a> or the " +
                                    "<a href=\"https://sdk.openui5.org\">UI5 demo kit</a>." })
                .a({ n: "markupDescription", b: true })
            .end()
        .end();

    page.ele("HBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event({ val: "OPEN_RELATIVE_ONLY",
                                    arg: "$event.oSource.sId" }) })
            .a({ n: "text",  v: "Open with RELATIVE_ONLY" })
            .a({ n: "type",  v: "Emphasized" })
        .tag("Button")
            .a({ n: "press", v: this.client._event({ val: "OPEN_ALLOW_ALL",
                                    arg: "$event.oSource.sId" }) })
            .a({ n: "text",  v: "Open with ALLOW_ALL" })
            .a({ n: "class", v: "sapUiTinyMarginBegin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event({ val: "OPEN_DENY_ALL",
                                    arg: "$event.oSource.sId" }) })
            .a({ n: "text",  v: "Open with DENY_ALL" })
            .a({ n: "class", v: "sapUiTinyMarginBegin" });

    this.client.view_display(view.stringify());

  }
});
