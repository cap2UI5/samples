// @keywords messagemanager validation target field state central model
// @summary The UI5 message model: validation messages carry the field they belong to, so the control shows the state and one list holds them all.
// @docs https://abap2ui5.github.io/docs/cookbook/translation_messages/message
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_467.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "cap2ui5";

const ty_s_message = {
  message:        "",
  description:    "",
  type:           "",
  target:         "",
  additionaltext: "",
};

defineApp("Z2UI5_CL_SMP_APP_467", class {

  t_messages = t.table(ty_s_message);
  name       = "";
  amount     = 0;

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.amount = 42;

      // app-authored messages - the controller's MessageManager.addMessages
      // equivalent. The z2ui5.cc.MessageManager companion reconciles this
      // table into the central message manager: each row becomes a
      // sap.ui.core.message.Message with the view's model as processor, so a
      // row with a target sets that field's valueState too.
      this.t_messages = [
          { message:        "Please enter a valid name",
            type:           "Error",
            additionaltext: "Name",
            target:         "/NAME" },
          { message:        "Draft saved automatically",
            type:           "Information",
            additionaltext: "Autosave" } ];

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
            .a({ n: "xmlns:z2ui5",  v: "z2ui5.cc" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Message - Message Model and MessageManager" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text", v: "Both sources of the central message> model in one page: the Name messages " +
                   "are AUTHORED BY THE APP (pushed from an ABAP table by the invisible " +
                   "z2ui5.cc.MessageManager companion - the Error targets the Name field and " +
                   "colours it), while typing letters into the Amount field collects the failed " +
                   "Integer validation AUTOMATICALLY - no app code, no roundtrip. Both render " +
                   "in the list below." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // invisible companion control: reconciles /T_MESSAGES into the message
    // manager (adds the app's messages, removes its own when they drop out,
    // leaves auto-collected validation untouched)
    page.ele({ n: "MessageManager", ns: "z2ui5" })
        .a({ n: "items", v: this.client._bind("t_messages") });

    page.ele("VBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Label")
            .a({ n: "text",  v: "Name (message authored by the app)" })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("name") })
        .tag("Label")
            .a({ n: "text",  v: "Amount (integer only - validation collected automatically)" })
        .tag("Input")
            .a({ n: "value", v: `{ path: '${this.client._bind({ val: "amount", path: true })}', ` +
                              `type: 'sap.ui.model.type.Integer' }` })
            .a({ n: "width", v: "12rem" });

    page.ele("List")
        .a({ n: "headerText", v: "Collected messages (message> model)" })
        .a({ n: "items",      v: "{message>/}" })
        .a({ n: "class",      v: "sapUiSmallMargin" })
        .a({ n: "noDataText", v: "no messages" })
        .tag("StandardListItem")
            .a({ n: "title",       v: "{message>message}" })
            .a({ n: "description", v: "{message>additionalText}" })
            .a({ n: "info",        v: "{message>type}" });

    this.client.view_display(view.stringify());

  }
});
