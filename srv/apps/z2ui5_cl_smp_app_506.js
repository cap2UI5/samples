// @keywords event argument literal quoted expression evaluated check_arg_literal t_arg data binding syntax dollar brace
// @summary An event argument that starts with $ or { is live UI5 expression syntax and gets resolved on the client - check_arg_literal sends it as the text it is.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_506.clas.abap
//
// Every argument of an _event( ) wire is written into the view. One that
// starts with `$` or `{` is written RAW, as live UI5 expression syntax -
// that is how `${$source&gt;/KEY}` reaches the handler as the row's value
// instead of as those thirteen characters.
//
// Data can start with those characters too: text a user typed, a key from
// a foreign system. Written raw it is RESOLVED, and what arrives is the
// result - the bound price instead of the text `${/PRICE}`. s_ctrl-
// check_arg_literal quotes every argument of that wire as a string, so the
// wire gives up expressions and carries data. Two buttons over the same
// argument show both readings side by side.
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_506", class {

  price     = "";
  argument  = "";
  raw_arg   = "";
  lit_arg   = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.price    = "1299.00";
      // the argument both wires start with: the client-side spelling of the
      // bound price, composed from the bind so the path is a registered one
      this.argument = `\${${client._bind({ val: "price", path: true })}}`;
      this.raw_arg  = "-";
      this.lit_arg  = "-";
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    switch (this.client.get_event()) {

      case "RAW":
        // what the client resolved: `${/PRICE}` names the bound price, so
        // its value arrives, not the text
        this.raw_arg = this.client.get_event_arg();
        break;

      case "LITERAL":
        // the same argument, quoted by check_arg_literal: the text arrives
        this.lit_arg = this.client.get_event_arg();
        break;

      case "REBUILD":
        // the argument is written into the view at render time, so a new
        // text needs a new view - the two wires below carry it from then on
        this.raw_arg = "-";
        this.lit_arg = "-";
        this.view_display();
        break;

    }

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
            .a({ n: "title",          v: "abap2UI5 - Event - Literal Arguments (check_arg_literal)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     t: "Both buttons send the same argument. Written raw, the $-expression is resolved and " +
                   "the bound price arrives; with s_ctrl-check_arg_literal the wire quotes it and the text " +
                   "arrives. Type any other text - $event, {= 1 + 1 } - press Rebuild, and the literal " +
                   "wire still delivers it unchanged." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const form = page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "One argument, two wires" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" });

    form.tag("Label")
        .a({ n: "text", v: "The bound price the raw argument resolves to" });
    form.tag("Input")
        .a({ n: "value", v: this.client._bind("price") });

    form.tag("Label")
        .a({ n: "text", v: "The argument both buttons carry" });
    form.tag("Input")
        .a({ n: "value", v: this.client._bind("argument") });
    form.tag("Button")
        .a({ n: "text",  v: "Rebuild the view with this argument" })
        .a({ n: "press", v: this.client._event("REBUILD") });

    // the raw wire is kept on the binding shape the sample starts with: any
    // other text typed above is only sent through the literal wire, because
    // an argument that is not valid expression syntax would break the view
    const raw_expr = `\${${this.client._bind({ val: "price", path: true })}}`;
    form.tag("Label")
        .a({ n: "text", v: "Raw - resolved on the client" });
    form.tag("Button")
        .a({ n: "text",  t: `Send ${raw_expr} raw` })
        .a({ n: "press", v: this.client._event({ val: "RAW",
                                              arg: raw_expr }) });
    form.tag("Text")
        .a({ n: "text", v: this.client._bind("raw_arg") });

    form.tag("Label")
        .a({ n: "text", v: "Literal - quoted by check_arg_literal" });
    form.tag("Button")
        .a({ n: "text",  t: `Send ${this.argument} as a literal` })
        .a({ n: "type",  v: "Emphasized" })
        .a({ n: "press", v: this.client._event({ val:    "LITERAL",
                                              arg:    this.argument,
                                              s_ctrl: { check_arg_literal: true } }) });
    form.tag("Text")
        .a({ n: "text", v: this.client._bind("lit_arg") });

    this.client.view_display(view.stringify());

  }
});
