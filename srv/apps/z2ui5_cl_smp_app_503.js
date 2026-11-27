// @keywords unit test abapunit testclasses assert testable logic method
// @summary The app logic in a method of its own - no client, no attributes - so the local test class beside the class can assert it with ABAP Unit.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_503.clas.abap
//
// Ported by hand: the original catches cx_sy_conversion_overflow, and
// JavaScript's numbers do not overflow - abap2js refuses TRY rather than
// guess what a CATCH means here. gross_amount( ) raises a RangeError where
// the ABAP method raises, and main( ) catches that one.
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_503", class {

  amount = 0;
  rate   = 0;
  gross  = "";

  main(client) {

    this.client = client;

    if (client.check_on_init()) {

      this.amount = 100;
      this.rate   = 19;

      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();

    } else if (client.check_on_event("CALC")) {

      // text typed into an Input bound to TYPE i does not dump: the framework
      // keeps the old number and names the field in t_model_skipped - so the
      // sum would silently use a value the screen no longer shows
      const t_skipped = client.get().t_model_skipped;
      if (t_skipped.length) {
        this.gross = "";
        client.message_box_display({ text: `'${t_skipped[0].value}' is no whole number this field can hold - it keeps its old value.`,
                                     type: "error" });
        return;
      }

      try {
        this.gross = `${this.gross_amount({ net: this.amount, percent: this.rate })}`;
      } catch (e) {
        if (!(e instanceof RangeError)) throw e;
        this.gross = "";
        client.message_box_display({ text: "The gross amount does not fit an integer - enter a smaller net amount or rate.",
                                     type: "error" });
      }
    }

  }

  // The logic under test: a net amount plus a percentage, rounded to whole
  // units. It takes what it needs and returns what it computes - it reads
  // no attribute, touches no client and starts no roundtrip, which is the
  // whole reason a test can call it.
  //
  // @parameter net | the net amount
  // @parameter percent | the tax rate, in percent
  // @parameter result | the gross amount, rounded to whole units, the half
  //                     away from zero
  // @raising RangeError | the gross does not fit TYPE i (cx_sy_conversion_overflow in ABAP)
  gross_amount({ net, percent } = {}) {

    // ABAP computes it as a packed number with no decimals, which rounds
    // commercially - the half away from zero, so -10.5 becomes -11 as 10.5
    // becomes 11. The rounding is the part worth a test.
    const gross = net + net * percent / 100;
    const result = Math.sign(gross) * Math.round(Math.abs(gross));

    // TYPE i: the assignment of a larger number raises in ABAP
    if (result > 2147483647 || result < -2147483648) throw new RangeError("the gross does not fit TYPE i");
    return result;
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
            .a({ n: "title",          v: "abap2UI5 - Basics VI - Unit Tests for the App Logic" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "The sum below is computed by gross_amount( ), a method that takes what it needs and " +
                   "returns what it computes - it reads no attribute and never sees the client. That is what makes " +
                   "it testable: the local test class in z2ui5_cl_smp_app_503.clas.testclasses.abap calls it with " +
                   "four inputs and asserts the four answers, without a browser, a view or a roundtrip. abapGit " +
                   "keeps that file beside the class, and CLSCCINCL in the .clas.xml is what says the class has one." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Gross from net" })
        .a({ n: "editable", b: true })
        .a({ n: "layout",   v: "ResponsiveGridLayout" })
        .ele({ n: "content", ns: "form" })
            .tag("Label")
                .a({ n: "text", v: "Net amount" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("amount") })
            .tag("Label")
                .a({ n: "text", v: "Tax rate in percent" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind("rate") })
            .tag("Label")
                .a({ n: "text", v: "Gross amount" })
            .tag("Text")
                .a({ n: "text", v: this.client._bind("gross") })
            .tag("Label")
                .a({ n: "text", v: "Run the logic" })
            .tag("Button")
                .a({ n: "text",  v: "gross_amount( )" })
                .a({ n: "type",  v: "Emphasized" })
                .a({ n: "press", v: this.client._event("CALC") });

    this.client.view_display(view.stringify());

  }
});
