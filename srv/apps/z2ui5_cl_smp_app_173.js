// @keywords xml templating xmlpreprocessor template:repeat template:if template:elseif template:with meta model metamodel metadata driven dynamic columns form nested repeat startindex length
// @summary XML templating driven by a meta model: table columns built with template:repeat, a form generated from a field catalogue with nested template:repeat, template:with and template:if/elseif/else, and a template:if that re-renders on a switch.
// @docs https://abap2ui5.github.io/docs/cookbook/view/xml_templating
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_173.clas.abap
//
// The view is expanded by the UI5 XMLPreprocessor before its controls exist.
// Its input is a meta model: data ABOUT the view - which columns a table has,
// which fields a form has and of which type - instead of the data it shows.
// A UI5 app would hand the preprocessor an OData meta model; here the meta
// model is plain ABAP data, bound like any attribute and read under the
// template> model name. The rows the controls then display stay ordinary
// runtime bindings against the default model.
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

const ty_s_data = {
  name: "",
  date: "",
  age:  "",
};

const ty_s_layout = {
  fname:   "",
  merge:   "",
  visible: "",
};

const ty_s_field = {
  name:  "",
  label: "",
  type:  "",
};

const ty_s_group = {
  title:   "",
  t_field: t.table(ty_s_field),
};

const ty_s_meta = {
  entity:  "",
  t_group: t.table(ty_s_group),
};

const ty_s_detail = {
  name:   "",
  date:   "",
  city:   "",
  age:    0,
  active: false,
};

defineApp("Z2UI5_CL_SMP_APP_173", class {

  mv_flag   = false;
  mt_layout = t.table(ty_s_layout);
  mt_data   = t.table(ty_s_data);
  ms_meta   = ty_s_meta;
  ms_detail = ty_s_detail;

  view_display() {

    // the template model is the view model, so what the repeat, the with and
    // the if read are bound attributes - their paths are composed from the
    // bind call, never written by hand
    const layout_path = `{template>${this.client._bind({ val: "mt_layout", path: true })}}`;
    const flag_path   = `{template>${this.client._bind({ val: "mv_flag", path: true })}}`;
    const meta_path   = `template>${this.client._bind({ val: "ms_meta", path: true })}`;
    const detail_path = `{${this.client._bind({ val: "ms_detail", path: true })}}`;

    let view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock",   v: "true" })
            .a({ n: "height",         v: "100%" })
            .a({ n: "xmlns",          v: "sap.m" })
            .a({ n: "xmlns:mvc",      v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",     v: "sap.ui.core" })
            .a({ n: "xmlns:form",     v: "sap.ui.layout.form" })
            .a({ n: "xmlns:template", v: "http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1" });

    view           = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Templating - Metadata-Driven Table and Form" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() })
            .a({ n: "class",          v: "sapUiContentPadding" })
            .a({ n: "id",             v: "page_main" });

    view.tag("MessageStrip")
        .a({ n: "text",     v: "XML templating expands the view from a meta model before any control exists: " +
                   "the table columns come from a layout table (template:repeat), the form from a field catalogue " +
                   "(template:with, nested template:repeat, template:if/elseif/else), and the icon below re-renders on the switch." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // 1 - columns and cells from the layout table
    view.tag("Title")
        .a({ n: "text",  v: "Table - columns from a layout table (template:repeat)" })
        .a({ n: "class", v: "sapUiSmallMarginTop" });

    view.ele("Table")
        .a({ n: "items", v: this.client._bind("mt_data") })
        .ele("columns")
            .ele({ n: "repeat", ns: "template" })
                .a({ n: "list", v: layout_path })
                .a({ n: "var",  v: "L0" })
                .ele("Column")
                    .a({ n: "mergeDuplicates", v: "{L0>MERGE}" })
                    .a({ n: "visible",         v: "{L0>VISIBLE}" })
                    .tag("Text")
                        .a({ n: "text", v: "{L0>FNAME}" })
                .end()
            .end()
        .end()
        .ele("items")
            .ele("ColumnListItem")
                .ele("cells")
                    .ele({ n: "repeat", ns: "template" })
                        .a({ n: "list", v: layout_path })
                        .a({ n: "var",  v: "L1" })
                        .ele("ObjectIdentifier")
                            .a({ n: "text", v: "{= '{' + ${L1>FNAME} + '}' }" });

    // 2 - a form from the field catalogue of the meta model. template:with
    // gives the meta model a short name, the outer repeat builds one title
    // per group, the inner repeat one label and one control per field, and
    // the if/elseif/else picks the control from the field's type
    view.tag("Title")
        .a({ n: "text",  v: "Form - fields from a meta model (template:with, nested repeat, if/elseif/else)" })
        .a({ n: "class", v: "sapUiMediumMarginTop" });

    const box = view.ele({ n: "with", ns: "template" })
        .a({ n: "path", v: meta_path })
        .a({ n: "var",  v: "meta" })
        .ele("VBox")
            .a({ n: "binding", v: detail_path });

    // startIndex and length cut the list - the header shows the first two
    // fields of the first group only
    box.ele("ObjectHeader")
        .a({ n: "title", v: "{meta>ENTITY}" })
        .ele("attributes")
            .ele({ n: "repeat", ns: "template" })
                .a({ n: "list", v: "{path: 'meta>T_GROUP/0/T_FIELD', startIndex: 0, length: 2}" })
                .a({ n: "var",  v: "head" })
                .tag("ObjectAttribute")
                    .a({ n: "title", v: "{head>LABEL}" })
                    .a({ n: "text",  v: "{= '{' + ${head>NAME} + '}' }" });

    const field = box.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "editable", b: true })
        .a({ n: "layout",   v: "ResponsiveGridLayout" })
        .ele({ n: "content", ns: "form" })
            .ele({ n: "repeat", ns: "template" })
                .a({ n: "list", v: "{meta>T_GROUP}" })
                .a({ n: "var",  v: "group" })
                .tag({ n: "Title", ns: "core" })
                    .a({ n: "text", v: "{group>TITLE}" })
                .ele({ n: "repeat", ns: "template" })
                    .a({ n: "list", v: "{group>T_FIELD}" })
                    .a({ n: "var",  v: "field" });

    field.tag("Label")
        .a({ n: "text", v: "{field>LABEL}" });

    field.ele({ n: "if", ns: "template" })
        .a({ n: "test", v: "{= ${field>TYPE} === 'BOOLEAN' }" })
        .ele({ n: "then", ns: "template" })
            .tag("Switch")
                .a({ n: "state", v: "{= '{' + ${field>NAME} + '}' }" })
        .end()
        .ele({ n: "elseif", ns: "template" })
            .a({ n: "test", v: "{= ${field>TYPE} === 'DATE' }" })
            .tag("DatePicker")
                .a({ n: "value",       v: "{= '{' + ${field>NAME} + '}' }" })
                .a({ n: "valueFormat", v: "yyyy-MM-dd" })
        .end()
        .ele({ n: "elseif", ns: "template" })
            .a({ n: "test", v: "{= ${field>TYPE} === 'NUMBER' }" })
            .tag("StepInput")
                .a({ n: "value", v: "{= '{' + ${field>NAME} + '}' }" })
        .end()
        .ele({ n: "else", ns: "template" })
            .tag("Input")
                .a({ n: "value", v: "{= '{' + ${field>NAME} + '}' }" });

    // 3 - an if on a bound flag, re-rendered by the switch
    view.tag("Title")
        .a({ n: "text",  v: "IF Template (with re-rendering)" })
        .a({ n: "class", v: "sapUiMediumMarginTop" });
    view.tag("Switch")
        .a({ n: "state",  v: this.client._bind("mv_flag") })
        .a({ n: "change", v: this.client._event("CHANGE_FLAG") });
                  view   = view.ele("VBox");

    view.ele({ n: "if", ns: "template" })
        .a({ n: "test", v: flag_path })
        .ele({ n: "then", ns: "template" })
            .tag({ n: "Icon", ns: "core" })
                .a({ n: "color", v: "green" })
                .a({ n: "src",   v: "sap-icon://accept" })
        .end()
        .ele({ n: "else", ns: "template" })
            .tag({ n: "Icon", ns: "core" })
                .a({ n: "color", v: "red" })
                .a({ n: "src",   v: "sap-icon://decline" });

    this.client.view_display(view.stringify());

  }

  model_init() {

    this.mt_data = [ { name: "Theo", date: "01.01.2000", age: "5" },
                       { name: "Lore", date: "01.01.2000", age: "1" } ];

    this.mt_layout = [ { fname: "NAME", merge: "false", visible: "true" },
                         { fname: "DATE", merge: "false", visible: "true" },
                         { fname: "AGE",  merge: "false", visible: "false" } ];

    // the meta model - which fields the form has, in which group, of which
    // type. Reorder a field, move it to the other group or change its type
    // and the generated form follows, no view code changes
    this.ms_meta = {
      entity:  "Person",
      t_group: [
        { title:   "General",
          t_field: [ { name: "NAME", label: "Name",       type: "STRING" },
                             { name: "DATE", label: "Birth Date", type: "DATE" },
                             { name: "CITY", label: "City",       type: "STRING" } ] },
        { title:   "Details",
          t_field: [ { name: "AGE",    label: "Age",    type: "NUMBER" },
                             { name: "ACTIVE", label: "Active", type: "BOOLEAN" } ] } ] };

    this.ms_detail = { name:   "Lore",
                         date:   "2000-01-01",
                         city:   "Walldorf",
                         age:    26,
                         active: true };

  }

  main(client) {

    this.client = client;

    if (client.check_on_init()) {
      this.model_init();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("CHANGE_FLAG")) {
      this.view_display();
    }

  }
});
