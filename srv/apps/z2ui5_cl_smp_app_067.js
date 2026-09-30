// @keywords amount decimals leading zeros number format
// @summary Formats amounts with sap.ui.model.type.Currency, so decimals and leading zeros follow the currency rather than the ABAP field.
// @docs https://abap2ui5.github.io/docs/cookbook/model/formatter
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_067.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_067", class {

  amount   = t.packed(14, 3);
  currency = "";
  numeric  = t.numc(12);

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.numeric  = "000000000012";
      this.amount   = 123456789.123;
      this.currency = "USD";
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("BUTTON")) {
      // the roundtrip IS the demo: the edited amounts travel back and re-render
      this.view_display();
    }

  }

  view_display() {

    const page = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" })
            .ele("Shell")
                .ele("Page")
                    .a({ n: "title",          v: "abap2UI5 - Binding - Currency Amounts (sap.ui.model.type.Currency)" })
                    .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
                    .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Formats amounts with the sap.ui.model.type.Currency type and its format options, " +
                   "and shows how to strip the leading zeros from a numeric field." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Currency" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Title")
                .a({ n: "text", v: "Input" })
            .tag("Label")
                .a({ n: "text", v: "Documentation" })
            .tag("Link")
                .a({ n: "text",   v: "https://sdk.openui5.org/entity/sap.ui.model.type.Currency" })
                .a({ n: "href",   v: "https://sdk.openui5.org/entity/sap.ui.model.type.Currency" })
                .a({ n: "target", v: "_blank" })
            .tag("Label")
                .a({ n: "text", v: "One field" })
            .tag("Input")
                .a({ n: "value", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                 path: true })}', '${this.client._bind({
                                                 val:  "currency",
                                                 path: true })}'],  type: 'sap.ui.model.type.Currency' }` })
            .tag("Label")
                .a({ n: "text", v: "Two field" })
            .tag("Input")
                .a({ n: "value", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                 path: true })}', '${this.client._bind({
                                                 val:  "currency",
                                                 path: true })}'],  type: 'sap.ui.model.type.Currency' , formatOptions: {showMeasure: false}  }` })
            .tag("Input")
                .a({ n: "value", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                 path: true })}', '${this.client._bind({
                                                 val:  "currency",
                                                 path: true })}'],  type: 'sap.ui.model.type.Currency' , formatOptions: {showNumber: false} }` })
            .tag("Label")
                .a({ n: "text", v: "Default" })
            .tag("Text")
                .a({ n: "text", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                 path: true })}', '${this.client._bind({
                                                 val:  "currency",
                                                 path: true })}'],  type: 'sap.ui.model.type.Currency' }` })
            .tag("Label")
                .a({ n: "text", v: "preserveDecimals:false" })
            .tag("Text")
                .a({ n: "text", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                      path: true })}', '` + this.client._bind({
                                                         val:  "currency",
                                                         path: true }) +
                     `'],  type: 'sap.ui.model.type.Currency' , formatOptions: { preserveDecimals : false } }` })
            .tag("Label")
                .a({ n: "text", v: "currencyCode:false" })
            .tag("Text")
                .a({ n: "text", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                      path: true })}', '` + this.client._bind({
                                                         val:  "currency",
                                                         path: true }) +
                         `'],  type: 'sap.ui.model.type.Currency' , formatOptions: { currencyCode : false } }` })
            .tag("Label")
                .a({ n: "text", v: "style:'short'" })
            .tag("Text")
                .a({ n: "text", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                 path: true })}', '${this.client._bind({
                                                 val:  "currency",
                                                 path: true })}'],  type: 'sap.ui.model.type.Currency' , formatOptions: { style : 'short' } }` })
            .tag("Label")
                .a({ n: "text", v: "style:'long'" })
            .tag("Text")
                .a({ n: "text", v: `{ parts: [ '${this.client._bind({ val:  "amount",
                                                 path: true })}', '${this.client._bind({
                                                 val:  "currency",
                                                 path: true })}'],  type: 'sap.ui.model.type.Currency' , formatOptions: {   style : 'long' } }` })
            .tag("Label")
                .a({ n: "text", v: "event" })
            .tag("Button")
                .a({ n: "press", v: this.client._event("BUTTON") })
                .a({ n: "text",  v: "send" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "No Zeros" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Title")
                .a({ n: "text", v: "Input" })
            .tag("Label")
                .a({ n: "text", v: "Documentation" })
            .tag("Link")
                .a({ n: "text",   v: "https://sdk.openui5.org/api/sap.ui.model.odata.type.String%23methods/formatValue" })
                .a({ n: "href",   v: "https://sdk.openui5.org/api/sap.ui.model.odata.type.String%23methods/formatValue" })
                .a({ n: "target", v: "_blank" })
            .tag("Label")
                .a({ n: "text", v: "Numeric" })
            .tag("Input")
                .a({ n: "value", v: this.client._bind({ val: "numeric" }) })
            .tag("Label")
                .a({ n: "text", v: "Without leading Zeros" })
            .tag("Text")
                .a({ n: "text", v: `{path : '${this.client._bind({
                            val:  "numeric",
                            path: true })}', type : 'sap.ui.model.odata.type.String', constraints : {  isDigitSequence : true } }` });

    this.client.view_display(page.stringify());

  }
});
