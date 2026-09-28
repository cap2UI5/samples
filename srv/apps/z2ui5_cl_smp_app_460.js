// @keywords hierarchy nodes nested json items
// @summary A nested ABAP table rendered as a sap.m.Tree - the hierarchy comes from the data, not from the view.
// @docs https://abap2ui5.github.io/docs/cookbook/model/trees
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_460.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "cap2ui5";

const ty_s_node_level3 = {
  text: "",
};

const ty_s_node_level2 = {
  text:  "",
  nodes: t.table(ty_s_node_level3),
};

const ty_s_node_level1 = {
  text:  "",
  nodes: t.table(ty_s_node_level2),
};

defineApp("Z2UI5_CL_SMP_APP_460", class {

  t_nodes = t.table(ty_s_node_level1);

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.t_nodes = [
          { text: "Documents", nodes: [
              { text: "Projects", nodes: [
                  { text: "Roadmap.docx" },
                  { text: "Budget.xlsx" } ] },
              { text: "Reports", nodes: [
                  { text: "Q1.pdf" },
                  { text: "Q2.pdf" } ] } ] },
          { text: "Pictures", nodes: [
              { text: "Vacation", nodes: [
                  { text: "Beach.jpg" } ] } ] },
          { text: "Music" } ];
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
            .a({ n: "title",          v: "abap2UI5 - Tree - Nested ABAP Table in a sap.m.Tree" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "A nested ABAP table (three levels of NODES) serializes into nested JSON arrays; " +
                   "sap.m.Tree binds them directly - no flattening, no extra code." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("Tree")
        .a({ n: "id",         v: "tree1" })
        .a({ n: "items",      v: this.client._bind("t_nodes") })
        .a({ n: "headerText", v: "Files" })
        .tag("StandardTreeItem")
            .a({ n: "title", v: "{TEXT}" });

    this.client.view_display(view.stringify());

  }
});
