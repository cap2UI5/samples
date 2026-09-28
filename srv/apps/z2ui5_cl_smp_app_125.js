/**
 * Browser - Set the Tab Title (A)
 *
 * Sets the browser tab title from the app, so a bookmarked or duplicated window
 * says which app it holds.
 *
 * The facade `c` has no follow_up_action( ) yet, so this sample reaches the
 * framework's own z2ui5_if_client through the escape hatch c.raw: asynchronous,
 * and with the ABAP-typed arguments the transpiled method expects.
 *
 * @keywords document.title tab caption headline set_title follow_up_action raw
 * @origin abap2UI5/samples src/z2ui5_cl_smp_app_125.clas.abap
 */
/* global abap */
import { defineApp } from "cap2ui5";

const INFO =
  "Enter a title and press the button to run the SET_TITLE front-end action, which updates " +
  "the browser tab title (document.title) without reloading the page.";

/** z2ui5_if_client~follow_up_action( val = action t_arg = args ), through c.raw */
async function followUpAction(c, action, args = []) {
  const t_arg = abap.types.TableFactory.construct(
    new abap.types.String({ qualifiedName: "STRING" }),
    {
      withHeader: false,
      keyType: "DEFAULT",
      primaryKey: { isUnique: false, type: "STANDARD", keyFields: [], name: "primary_key" },
      secondary: [],
    },
    "STRING_TABLE");
  for (const arg of args) t_arg.append(new abap.types.String().set(String(arg)));
  await c.raw.z2ui5_if_client$follow_up_action({ val: action, t_arg });
}

defineApp("Z2UI5_CL_SMP_APP_125", class {
  title = "my title";

  async main(c) {
    if (c.isDisplay) {
      c.view(`
        <mvc:View
            xmlns:mvc="sap.ui.core.mvc"
            xmlns="sap.m"
            xmlns:form="sap.ui.layout.form"
            displayBlock="true"
            height="100%">
          <Shell>
            <Page
                title="cap2UI5 - Browser - Set the Tab Title"
                showNavButton="${c.canGoBack}"
                navButtonPress="${c.event("BACK")}">
              <MessageStrip text="${INFO}" type="Information" showIcon="true" class="sapUiSmallMargin"/>
              <form:SimpleForm title="Form Title" editable="true">
                <form:content>
                  <Label text="title"/>
                  <Input value="${c.bind("title")}"/>
                  <Button press="${c.event("SET_TITLE")}" text="Set Title"/>
                </form:content>
              </form:SimpleForm>
            </Page>
          </Shell>
        </mvc:View>`);
    } else if (c.eventName === "SET_TITLE") {
      await followUpAction(c, "SET_TITLE", [this.title]);
    } else if (c.eventName === "BACK") {
      c.navBack();
    }
  }
});
