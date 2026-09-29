// @keywords livechange keystroke queue busy roundtrip dropped event check_queue_last s_ctrl
// @summary Two identical liveChange wires side by side: the plain one drops every keystroke typed while a round-trip runs, the one registered with check_queue_last keeps the last of them, so the backend ends on what you typed.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_511.clas.abap
//
// abap2UI5 serializes round-trips: while one is in flight the app is busy and
// an event fired meanwhile is DROPPED. Right for a click, wrong for a wire
// that fires per keystroke - typing `abc` at once leaves the backend at `a`
// until the user pauses and types again. s_ctrl-check_queue_last keeps the
// LAST event fired during the flight in a one-slot buffer and dispatches it
// once the response has landed: one round-trip at a time, order preserved,
// the backend ends on the control's current value.
//
// Needs abap2UI5 newer than 1.144.0 - check_queue_last is appended to
// ty_s_event_control after that release; on an older framework the class
// does not activate (unknown component of s_ctrl).
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_511", class {

  plain_backend  = "";
  plain_count    = 0;
  queued_backend = "";
  queued_count   = 0;

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();

    } else if (client.check_on_event("PLAIN")) {

      this.plain_backend = client.get_event_arg();
      this.plain_count   = this.plain_count + 1;

    } else if (client.check_on_event("QUEUED")) {

      this.queued_backend = client.get_event_arg();
      this.queued_count   = this.queued_count + 1;

    }

  }

  view_display() {

    // Both Inputs below round-trip on every keystroke on purpose: this sample
    // EXISTS to show what the busy guard does to such a wire, and what the
    // check_queue_last flag changes about it.

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock",  v: "true" })
            .a({ n: "height",        v: "100%" })
            .a({ n: "xmlns",         v: "sap.m" })
            .a({ n: "xmlns:mvc",     v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:layout",  v: "sap.ui.layout" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Event - Keep the Last Keystroke with check_queue_last" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "abap2UI5 runs one round-trip at a time, and an event fired while one is in flight is dropped. " +
                   "Type quickly into both fields: the left backend value stops at an earlier keystroke, the right one " +
                   "ends on what you typed - its wire is registered with s_ctrl-check_queue_last, so the last event " +
                   "fired during the flight is kept and sent once the response has landed. The flag is for " +
                   "per-keystroke wires only (liveChange, liveSearch, sliderChange); Z2UI5_CL_SMP_APP_059 puts it to work on " +
                   "a live search over a large table." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // The Inputs are deliberately NOT bound: the keystroke travels as the
    // event argument ${$parameters>/value} and nowhere else, so what the
    // backend Text shows is exactly what the wire delivered.
    const grid = page.ele({ n: "Grid", ns: "layout" })
        .a({ n: "defaultSpan", v: "XL6 L6 M6 S12" })
        .ele({ n: "content", ns: "layout" });

    // left: the plain wire - keystrokes typed while a round-trip runs are dropped
    grid.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Title")
            .a({ n: "text",  v: "Plain wire - dropped while busy" })
            .a({ n: "level", v: "H4" })
        .tag("Input")
            .a({ n: "placeholder", v: "Type quickly ..." })
            .a({ n: "liveChange",  v: this.client._event({
                val: "PLAIN",
                arg: "${$parameters>/value}" }) })
        .tag("Label")
            .a({ n: "text", v: "Value in the backend" })
        .tag("Text")
            .a({ n: "text", v: this.client._bind("plain_backend") })
        .tag("Label")
            .a({ n: "text", v: "Round-trips" })
        .tag("Text")
            .a({ n: "text", v: this.client._bind("plain_count") });

    // right: the same wire with check_queue_last - the last keystroke of the
    // flight is kept and dispatched after the response; check_no_busy keeps
    // the busy overlay from covering the field while it is typed into
    grid.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Title")
            .a({ n: "text",  v: "check_queue_last - the last keystroke is kept" })
            .a({ n: "level", v: "H4" })
        .tag("Input")
            .a({ n: "placeholder", v: "Type quickly ..." })
            .a({ n: "liveChange",  v: this.client._event({
                val:    "QUEUED",
                arg:    "${$parameters>/value}",
                s_ctrl: { check_queue_last: true,
                                  check_no_busy:    true } }) })
        .tag("Label")
            .a({ n: "text", v: "Value in the backend" })
        .tag("Text")
            .a({ n: "text", v: this.client._bind("queued_backend") })
        .tag("Label")
            .a({ n: "text", v: "Round-trips" })
        .tag("Text")
            .a({ n: "text", v: this.client._bind("queued_count") });

    this.client.view_display(view.stringify());


  }
});
