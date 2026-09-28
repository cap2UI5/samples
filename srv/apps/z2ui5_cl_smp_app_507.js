// @keywords binding omit initial default property absent omit_initial omit_initial_paths ratingindicator maxvalue enabled boolean
// @summary An ABAP field is never absent, only initial - so a bound 0 overrides the UI5 default. omit_initial leaves initial fields out of the model, omit_initial_paths only the ones you name.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_507.clas.abap
//
// Three lists over the same rows, bound three ways. Each RatingIndicator
// reads maxValue and enabled from its row:
//
//  - plain _bind( ): every field reaches the client as a value, so a row
//    with no maxValue sends 0 and the control shows no stars - the UI5
//    default of 5 never had a chance
//  - omit_initial = abap_true: initial fields are left out, the default
//    applies - but abap_false is initial too, so the archived row loses
//    its enabled = false and becomes editable
//  - omit_initial_paths = MAXVALUE: only that column is omitted, the
//    boolean still travels, and both rows render as intended
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "cap2ui5";

const ty_s_row = {
  name:     "",
  value:    0,
  maxvalue: 0,
  enabled:  false,
  note:     "",
};

defineApp("Z2UI5_CL_SMP_APP_507", class {

  t_plain = t.table(ty_s_row);
  t_omit  = t.table(ty_s_row);
  t_paths = t.table(ty_s_row);

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      // the same rows three times - one attribute per binding, because the
      // omission is a property of the bind, not of the data
      this.t_plain = [
        { name: "Handling", value: 4, maxvalue: 5,  enabled: true,  note: "maxValue 5, enabled" },
        { name: "Price",    value: 7, maxvalue: 10, enabled: true,  note: "maxValue 10, enabled" },
        { name: "Design",   value: 3,                enabled: true,  note: "NO maxValue - the UI5 default 5 is meant" },
        { name: "Archived", value: 2, maxvalue: 5,  enabled: false, note: "maxValue 5, NOT enabled" } ];
      this.t_omit  = this.t_plain;
      this.t_paths = this.t_plain;
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    }

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
            .a({ n: "title",          v: "abap2UI5 - Binding - Omit Initial Values" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "The same four rows, bound three ways. Design has no maxValue and Archived is not " +
                   "enabled - watch what each binding makes of the two: a plain bind sends 0 for the missing " +
                   "maxValue, omit_initial drops it but drops the abap_false as well, omit_initial_paths " +
                   "drops only the column you name." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const row = page.ele("HBox")
        .a({ n: "wrap",  v: "Wrap" })
        .a({ n: "class", v: "sapUiSmallMargin" });

    this.render_list({ parent: row,
                 title:  "_bind( t_plain )",
                 descr:  "every field travels: Design gets maxValue 0 and shows no stars",
                 items:  this.client._bind("t_plain") });

    this.render_list({ parent: row,
                 title:  "_bind( t_omit omit_initial = abap_true )",
                 descr:  "initial fields stay out: Design shows 5 stars - but Archived is enabled now, its abap_false was initial too",
                 items:  this.client._bind({ val:          "t_omit",
                                         omit_initial: true }) });

    this.render_list({ parent: row,
                 title:  "_bind( t_paths omit_initial_paths = MAXVALUE )",
                 descr:  "only MAXVALUE stays out: Design shows 5 stars and Archived stays disabled",
                 items:  this.client._bind({ val:                "t_paths",
                                         omit_initial_paths: [ "MAXVALUE" ] }) });

    this.client.view_display(view.stringify());

  }

  render_list({ parent, title, descr, items } = {}) {

    const box = parent.ele("VBox")
        .a({ n: "width", v: "22rem" })
        .a({ n: "class", v: "sapUiSmallMarginEnd sapUiSmallMarginBottom" });

    box.tag("Title")
        .a({ n: "text",  t: title })
        .a({ n: "level", v: "H4" });
    box.tag("Text")
        .a({ n: "text",  t: descr })
        .a({ n: "class", v: "sapUiTinyMarginBottom" });

    box.ele("List")
        .a({ n: "items", v: items })
        .ele("CustomListItem")
            .ele("VBox")
                .a({ n: "class", v: "sapUiTinyMargin" })
                .tag("Label")
                    .a({ n: "text", v: "{NAME} - {NOTE}" })
                .tag("RatingIndicator")
                    .a({ n: "value",    v: "{VALUE}" })
                    .a({ n: "maxValue", v: "{MAXVALUE}" })
                    .a({ n: "enabled",  v: "{ENABLED}" })
                    .a({ n: "iconSize", v: "1.25rem" });

  }
});
