/**
 * Basics III - Lifecycle: First Run, Event, Display
 *
 * The three questions main( ) asks - c.isFirstRun, c.eventName, c.isDisplay -
 * as one dispatcher, showing what survives a roundtrip and what a navigation
 * does to it.
 *
 * @keywords lifecycle roundtrip main dispatcher state draft isFirstRun isDisplay eventName
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_495.clas.abap
 */
import { defineApp, t } from "cap2ui5";

const INFO =
  "main( ) runs on every roundtrip - c.isFirstRun, c.isDisplay and c.eventName tell it what " +
  "the roundtrip is about. The list logs each call, and it survives them all: every field of " +
  "the class is kept in the draft between the roundtrips, so the app keeps its state without " +
  "a table of its own. Press Log - only the model is pushed, the view is not rebuilt. Call the " +
  "sub-app and come back with its back button - that is the roundtrip c.isDisplay answers " +
  "without c.isFirstRun.";

defineApp("Z2UI5_CL_SMP_APP_495", class {
  t_log = t.table({ no: "", check: "" });

  main(c) {
    // `this` reads plain copies: a changed table is written back by assigning it
    const log = (check) => {
      this.t_log = [...this.t_log, { no: String(this.t_log.length + 1), check }];
    };

    if (c.isFirstRun) {
      log("c.isFirstRun - the very first call, nothing exists yet");
      c.view(view(c));
    } else if (c.isDisplay) {
      log("c.isDisplay - the sub-app returned, re-display the view");
      c.view(view(c));
    } else if (c.eventName === "LOG") {
      log("c.eventName - a button was pressed, the view stays as it is");
    } else if (c.eventName === "CALL") {
      log("c.eventName - calling Basics I as a sub-app");
      c.navTo("Z2UI5_CL_SMP_APP_493");
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});

function view(c) {
  return `
    <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
      <Shell>
        <Page
            title="cap2UI5 - Basics III - Lifecycle: First Run, Event, Display"
            showNavButton="${c.canGoBack}"
            navButtonPress="${c.event("BACK")}">
          <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
          <HBox class="sapUiSmallMargin">
            <Button press="${c.event("LOG")}" text="Log an Event"/>
            <Button press="${c.event("CALL")}" text="Call a Sub-App" class="sapUiTinyMarginBegin"/>
          </HBox>
          <List headerText="Calls of main( )" items="${c.bind("t_log")}" class="sapUiSmallMargin">
            <StandardListItem title="{CHECK}" description="call {NO}"/>
          </List>
        </Page>
      </Shell>
    </mvc:View>`;
}
