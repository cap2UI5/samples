// @keywords translation i18n text element text symbol textpool language message class multi language
// @summary Puts the screen texts in the class's own text elements instead of an i18n file, so SE63 translates them and the app shows them in the logon language.
// @docs https://abap2ui5.github.io/docs/cookbook/translation_messages/translation_i18n
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_519.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_519", class {

  name = "";

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    if (this.client.get_event() === "GREET") {
      // The text element is translated, the value is not - so the two are
      // concatenated here rather than written as one literal. A text element
      // with a placeholder would be a message class instead.
      this.client.message_box_display(`${"Hello"} ${this.name}`);
    }

  }

  view_display() {

    // the three text symbols this app is about - see the block below
    let name_label = "";
    let placeholder = "";
    let greet = "";

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Basics VII - Translatable Texts (Text Elements)" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "A UI5 app keeps its translations in i18n files. An abap2UI5 app has no frontend " +
                   "artefacts to put them in - and does not need any: the view is built in ABAP, so ABAP's own " +
                   "translation carries it. Text elements here, a message class where a text takes placeholders." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // Every text below comes out of the class's text pool (Goto > Text
    // Elements in SE24/ADT). The literal in the source is the fallback and the
    // maintenance text; what renders is the entry for the logon language.
    //
    // Read into a VARIABLE first, and that is part of the lesson: a text
    // symbol is a CHARACTER literal, while the builder's v is TYPE string.
    // Handing one straight to v answers `'...'(001) is not type-compatible
    // with formal parameter V` on a system - a SYNTAX_ERROR of the class,
    // although abaplint, the transpiler and the unit suite are all green on
    // it. The assignment below is a plain conversion and is allowed on every
    // release. Inside a string template ( see on_event( ) ) the symbol needs
    // no variable: an embedded expression is a general expression position.
    //
    // And handed to t, not v: a translation is text somebody else types, and
    // t escapes it, so a `{` or `\` in one language's entry is shown rather
    // than read by UI5 as a binding.
    name_label  = "Your name";
    placeholder = "Type a name here";
    greet       = "Greet";

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Label")
            .a({ n: "text",     t: name_label })
            .a({ n: "labelFor", v: "nameInput" })
        .tag("Input")
            .a({ n: "id",          v: "nameInput" })
            .a({ n: "value",       v: this.client._bind("name") })
            .a({ n: "placeholder", t: placeholder })
            .a({ n: "width",       v: "20rem" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("GREET") })
            .a({ n: "text",  t: greet })
            .a({ n: "type",  v: "Emphasized" })
            .a({ n: "class", v: "sapUiSmallMarginTop" });

    this.client.view_display(view.stringify());

  }
});
