/**
 * Popup - Dialog inside a Dialog
 *
 * A dialog opened from inside a dialog, and what closing the inner one does to
 * the stack.
 *
 * @keywords nested stack popup in popup second dialog
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_161.clas.abap
 */
import { defineApp } from "cap2ui5";

const INFO =
  "This sample opens a popup from a button and then chains to a second popup " +
  "from within the first one.";

defineApp("Z2UI5_CL_SMP_APP_161", class {

  main(c) {
    if (c.isDisplay) {
      c.view(`
        <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
          <Shell>
            <Page
                title="cap2UI5 - Popup - Dialog inside a Dialog"
                showNavButton="${c.canGoBack}"
                navButtonPress="${c.event("BACK")}">
              <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
              <Button press="${c.event("POPUP")}" text="Open Popup..."/>
            </Page>
          </Shell>
        </mvc:View>`);
      return;
    }

    switch (c.eventName) {
      case "POPUP":
        c.popup(popup1(c));
        break;
      case "GOTO_2ND":
        c.popup(popup2(c));
        break;
      case "BTN_OK_2ND":
        c.popupClose();
        c.popup(popup1(c));
        break;
      case "BTN_OK_1ND":
        c.popupClose();
        break;
      case "BACK":
        c.navBack();
        break;
    }
  }
});

function popup1(c) {
  return `
    <core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
      <Dialog afterClose="${c.event("BTN_OK_1ND")}">
        <content>
          <Button press="${c.event("GOTO_2ND")}" text="Open 2nd popup"/>
        </content>
        <buttons>
          <Button press="${c.event("BTN_OK_1ND")}" text="OK" type="Emphasized"/>
        </buttons>
      </Dialog>
    </core:FragmentDefinition>`;
}

function popup2(c) {
  return `
    <core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
      <Dialog afterClose="${c.event("BTN_OK_2ND")}">
        <content>
          <Label text="this is a second popup"/>
        </content>
        <buttons>
          <Button press="${c.event("BTN_OK_2ND")}" text="GOTO 1ST POPUP" type="Emphasized"/>
        </buttons>
      </Dialog>
    </core:FragmentDefinition>`;
}
