// @keywords structure component include flat form level
// @summary Binds a form to a structure with INCLUDEs, so the included components are reachable under their own names on one flat level.
// @docs https://abap2ui5.github.io/docs/cookbook/model/binding
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_166.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "cap2ui5";

const ty_s_struc_incl = {
  incl_title:  "",
  incl_value:  "",
  incl_value2: "",
};

const ty_s_struc = {
  title:  "",
  value:  "",
  value2: "",
};

defineApp("Z2UI5_CL_SMP_APP_166", class {

  ms_struc = ty_s_struc;

  ms_struc2 = {
    ...ty_s_struc,
    ...ty_s_struc_incl,
  };

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Binding - Structure Fields and INCLUDEs" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "This sample demonstrates structure-level binding: each input is bound to a " +
                   "field of a flat structure, including fields pulled in via INCLUDE." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc-title" }) });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc-value" }) });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc-value2" }) });

    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc2-title" }) });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc2-value" }) });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc2-value2" }) });

    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc2-incl_title" }) });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc2-incl_value" }) });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind({ val: "ms_struc2-incl_value2" }) });

    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;

    if (client.check_on_init()) {

      this.ms_struc  = { ...this.ms_struc, title: "title" };
      this.ms_struc  = { ...this.ms_struc, value: "val01" };
      this.ms_struc = { ...this.ms_struc, value2: "val02" };

      this.ms_struc2  = { ...this.ms_struc2, title: "title" };
      this.ms_struc2  = { ...this.ms_struc2, value: "val01" };
      this.ms_struc2 = { ...this.ms_struc2, value2: "val02" };
      this.ms_struc2 = { ...this.ms_struc2, incl_title: "title_incl" };
      this.ms_struc2 = { ...this.ms_struc2, incl_value: "val01_incl" };
      this.ms_struc2 = { ...this.ms_struc2, incl_value2: "val02_incl" };

      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }

  }
});
