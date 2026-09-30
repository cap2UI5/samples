// @keywords formatter parts conditional regexp visible enabled syntax
// @summary Expression binding in the view - conditions, composite parts and a regular expression decide visible and enabled without asking the backend.
// @docs https://abap2ui5.github.io/docs/cookbook/model/expression_binding
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_027.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_027", class {

  product  = "";
  quantity = 0;
  input2   = "";
  input31  = 0;
  input32  = 0;
  input41  = "";
  input51  = "";
  input52  = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.product  = "tomato";
      this.quantity = 500;
      this.input41  = "faasdfdfsaVIp";
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
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Binding - Expression Binding, Types and Composite Parts" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Advanced binding syntax: expression binding, typed bindings, conditional enabling " +
                   "with RegExp checks, and composite (parts) bindings." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const form = page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Binding Syntax" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" });

    form.tag("Title")
        .a({ n: "text", v: "Expression Binding" })
        .tag("Label")
            .a({ n: "text", v: "Documentation" })
        .tag("Link")
            .a({ n: "text",   v: "Expression Binding" })
            .a({ n: "href",   v: "https://sdk.openui5.org/topic/daf6852a04b44d118963968a1239d2c0" })
            .a({ n: "target", v: "_blank" })
        .tag("Label")
            .a({ n: "text", v: "input in uppercase" })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("input2") })
        .tag("Input")
            .a({ n: "enabled", b: false })
            .a({ n: "value",   v: `{= $${this.client._bind("input2")}.toUpperCase() }` })
        .tag("Label")
            .a({ n: "text", v: "max value of the first two inputs" })
        .tag("Input")
            .a({ n: "value", v: `{ type : "sap.ui.model.type.Integer", path:"${this.client._bind({ val: "input31", path: true })}" }` })
        .tag("Input")
            .a({ n: "value", v: `{ type : "sap.ui.model.type.Integer", path:"${this.client._bind({ val: "input32", path: true })}" }` })
        .tag("Input")
            .a({ n: "enabled", b: false })
            .a({ n: "value",   v: `{= Math.max($${this.client._bind("input31")}, $${this.client._bind("input32")}) }` })
        .tag("Label")
            .a({ n: "text", v: "only enabled when the quantity equals 500" })
        .tag("Input")
            .a({ n: "value", v: `{ type : "sap.ui.model.type.Integer", path:"${this.client._bind({ val: "quantity", path: true })}" }` })
        .tag("Input")
            .a({ n: "enabled", v: `{= 500===$${this.client._bind("quantity")} }` })
            .a({ n: "value",   v: this.client._bind("product") })
        .tag("Label")
            .a({ n: "text", v: "RegExp Set to enabled if the input contains VIP, ignoring the case." })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("input41") })
        .tag("Button")
            .a({ n: "text",    v: "VIP" })
            .a({ n: "enabled", v: `{= RegExp('vip', 'i').test($${this.client._bind("input41")}) }` })
        .tag("Label")
            .a({ n: "text", v: "concatenate both inputs" })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("input51") })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("input52") })
        .tag("Input")
            .a({ n: "enabled", b: false })
            .a({ n: "value",   v: `{ parts: [ "${this.client._bind({ val: "input51", path: true })}", ` +
                                    `"${this.client._bind({ val: "input52", path: true })}" ] }` });

    this.client.view_display(view.stringify());

  }
});
