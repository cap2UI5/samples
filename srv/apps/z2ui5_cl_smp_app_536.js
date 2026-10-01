// @keywords customdata data app namespace attach control list template t_arg
// @summary Attaches data objects to controls - with the app: namespace shortcut, bound or static, and as a CustomData template in a list binding - and reads them back with data( ) when an event fires.
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_536.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

const ty_s_question = {
  question: "",
  answer:   "",
};

defineApp("Z2UI5_CL_SMP_APP_536", class {

  coords      = "";
  answer      = "";
  t_questions = t.table(ty_s_question);

  main(client) {

    this.client = client;

    if (client.check_on_init()) {

      this.coords      = "49.29, 8.64";
      this.t_questions = [
          { question: "What does data( ) return without a key?",
            answer:   "A plain object that holds all custom data of the control." },
          { question: "Which namespace makes the attribute shortcut work?",
            answer:   "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" },
          { question: "Can the value of a custom data be bound?",
            answer:   "Yes - it is a normal property and follows its binding like any other." } ];
      this.view_display();

    } else if (client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }

  }

  on_event() {

    switch (true) {

      case this.client.check_on_event("STATIC"):
        this.client.message_toast_display(`data( "mySuperExtraData" ) = ${this.client.get_event_arg()}`);
        break;

      case this.client.check_on_event("BOUND"):
        this.client.message_toast_display(`data( "coords" ) = ${this.client.get_event_arg()}`);
        break;

      case this.client.check_on_event("ALL"):
        // data( ) without a key answers a plain object - an object argument
        // reaches the backend as its JSON text
        this.client.message_toast_display(`data( ) = ${this.client.get_event_arg()}`);
        break;

      case this.client.check_on_event("SELECT"):
        // the answer is not looked up in t_questions - it arrives as the
        // custom data of the list item the user selected
        this.answer = this.client.get_event_arg();
        break;

    }

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",   v: "sap.ui.core" })
            .a({ n: "xmlns:app",    v: "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" });
    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Event - Custom Data Attached to Controls" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Every control can carry data objects of its own with data( ). In an XML view they are written as " +
                   "app:key=\"value\" attributes or as core:CustomData elements, statically or bound, and an event " +
                   "argument reads them back with data( 'key' ) when the control fires." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // app:key="value" is the shortcut for a core:CustomData element in the
    // customData aggregation - it needs the xmlns:app namespace declared above.
    // The backend SETS custom data through the binding (app:coords follows the
    // input), and reads it back with data( ) as an event argument. Writing it
    // into the HTML DOM as a data-* attribute is Z2UI5_CL_SMP_APP_535
    const panel = page.ele("Panel")
        .a({ n: "headerText", v: "The app: namespace shortcut" })
        .a({ n: "class",      v: "sapUiResponsiveMargin" })
        .a({ n: "width",      v: "auto" });

    panel.ele("HBox")
        .a({ n: "alignItems", v: "Center" })
        .tag("Button")
            .a({ n: "text",                 v: "Without Binding" })
            .a({ n: "class",                v: "sapUiSmallMarginEnd" })
            .a({ n: "app:mySuperExtraData", v: "just great" })
            .a({ n: "press",                v: this.client._event({ val: "STATIC",
                                                                 arg: "$event.getSource().data('mySuperExtraData')" }) })
        .tag("Input")
            .a({ n: "value", v: this.client._bind("coords") })
            .a({ n: "width", v: "12rem" })
            .a({ n: "class", v: "sapUiSmallMarginEnd" })
        .tag("Button")
            .a({ n: "text",       v: "With Binding" })
            .a({ n: "class",      v: "sapUiSmallMarginEnd" })
            .a({ n: "app:coords", v: this.client._bind("coords") })
            .a({ n: "press",      v: this.client._event({ val: "BOUND",
                                                       arg: "$event.getSource().data('coords')" }) })
        .tag("Button")
            .a({ n: "text",                 v: "All Custom Data" })
            .a({ n: "app:myData",           v: "Hello" })
            .a({ n: "app:mySuperExtraData", v: "just great" })
            .a({ n: "press",                v: this.client._event({ val: "ALL",
                                                                 arg: "$event.getSource().data()" }) });

    // a core:CustomData in the item template is cloned for every row, and its
    // value binding resolves against that row - so each item carries its answer
    const list = page.ele("List")
        .a({ n: "headerText",      v: "CustomData in a list binding - select a question" })
        .a({ n: "mode",            v: "SingleSelectMaster" })
        .a({ n: "items",           v: this.client._bind("t_questions") })
        .a({ n: "class",           v: "sapUiResponsiveMargin" })
        .a({ n: "width",           v: "auto" })
        .a({ n: "selectionChange", v: this.client._event({ val: "SELECT",
                                                        arg: "${$parameters>/listItem}.data('answer')" }) });

    list.ele("StandardListItem")
        .a({ n: "title", v: "{QUESTION}" })
        .ele("customData")
            .tag({ n: "CustomData", ns: "core" })
                .a({ n: "key",   v: "answer" })
                .a({ n: "value", v: "{ANSWER}" });

    page.tag("Text")
        .a({ n: "text",  v: "Answer read from the selected item: " + this.client._bind("answer") })
        .a({ n: "class", v: "sapUiResponsiveMargin" });

    this.client.view_display(view.stringify());

  }
});
