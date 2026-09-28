// @keywords popup expand state hierarchy nodes
// @summary A tree inside a dialog, including which nodes stay expanded when the popup is opened again.
// @docs https://abap2ui5.github.io/docs/cookbook/model/trees
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_462.clas.abap
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

defineApp("Z2UI5_CL_SMP_APP_462", class {

  t_nodes = t.table(ty_s_node_level1);

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.t_nodes = [
          { text: "Sales", nodes: [
              { text: "Orders", nodes: [
                  { text: "4711 - Notebook Basic" },
                  { text: "4712 - Ergo Screen" } ] },
              { text: "Quotations", nodes: [
                  { text: "Q-001 - ITelO Vault" } ] } ] },
          { text: "Purchasing", nodes: [
              { text: "Suppliers", nodes: [
                  { text: "Very Best Screens" } ] } ] } ];
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    switch (this.client.get_event()) {

      case "OPEN_POPUP":
        this.popup_display();
        break;

      case "CLOSE_POPUP":
        // closing goes through the backend ON PURPOSE: the z2ui5.cc.Tree
        // companion snapshots the expand state right before every roundtrip,
        // so this event captures it while the dialog still exists - a pure
        // client-side popup_close would skip the snapshot
        this.client.popup_destroy();
        break;

    }

  }

  popup_display() {

    const popup = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "FragmentDefinition", ns: "core" })
            .a({ n: "xmlns",       v: "sap.m" })
            .a({ n: "xmlns:core",  v: "sap.ui.core" })
            .a({ n: "xmlns:z2ui5", v: "z2ui5.cc" });
    const dialog = popup.ele("Dialog")
        .a({ n: "title", v: "abap2UI5 - Tree - Inside a Dialog" });

    // the popup view slot gets its own copy of the model - the nested table
    // bound here renders in the dialog exactly like in a main view
    dialog.ele("Tree")
        .a({ n: "id",         v: "treePopup" })
        .a({ n: "items",      v: this.client._bind("t_nodes") })
        .a({ n: "headerText", v: "Documents" })
        .tag("StandardTreeItem")
            .a({ n: "title", v: "{TEXT}" });

    // invisible companion: snapshots the tree's expand state before each
    // roundtrip and re-applies it after rendering - reopening the dialog
    // shows the same nodes expanded as when it was closed
    dialog.tag({ n: "Tree", ns: "z2ui5" });

    dialog.ele("buttons")
        .tag("Button")
            .a({ n: "press", v: this.client._event("CLOSE_POPUP") })
            .a({ n: "text",  v: "Close" });

    this.client.popup_display(popup.stringify());

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
            .a({ n: "title",          v: "abap2UI5 - Tree - Inside a Dialog" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text", v: "The button opens a Dialog whose content is a sap.m.Tree over a nested ABAP " +
                   "table. Expand some nodes, close and reopen: the z2ui5.cc.Tree companion " +
                   "preserves the expand state across the roundtrips." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("OPEN_POPUP") })
            .a({ n: "text",  v: "Open tree popup" })
            .a({ n: "icon",  v: "sap-icon://tree" });

    this.client.view_display(view.stringify());

  }
});
