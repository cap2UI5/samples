// @keywords datepicker datevalue javascript date object iso
// @summary The DatePicker's dateValue wants a JavaScript date object rather than a string - what that means for the binding of an ABAP date.
// @docs https://abap2ui5.github.io/docs/cookbook/model/formatter
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_457.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_457", class {

  date_iso = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.date_iso = "2026-07-20";
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
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",   v: "sap.ui.core" });

    // the minimal date-object case: DatePicker.dateValue is typed "object"
    // and demands a real JS Date - a plain string binding crashes view
    // creation. Formatter.DateCreateObject converts the model's ISO string
    // at this one binding; the model itself keeps the plain string (the
    // Text below proves it).
    view.a({ n: "core:require", v: "{Formatter: 'z2ui5/model/formatter'}" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Formatter - Date Object for the DatePicker" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "dateValue is an object-typed property: the ISO string from the model becomes a " +
                   "real JS Date via Formatter.DateCreateObject - only at this binding, the model " +
                   "stays a plain string." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // the path must come from _bind - a hardcoded binding path is never
    // registered in the model and the frontend receives no data for it
    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("DatePicker")
            .a({ n: "displayFormat", v: "long" })
            .a({ n: "dateValue",     v: `{ path: '${this.client._bind({ val: "date_iso", path: true })}', ` +
                                        `formatter: 'Formatter.DateCreateObject' }` })
        .tag("Text")
            .a({ n: "text",  v: `Model value (unchanged string): ${this.client._bind("date_iso")}` })
            .a({ n: "class", v: "sapUiTinyMarginTop" });

    this.client.view_display(view.stringify());

  }
});
