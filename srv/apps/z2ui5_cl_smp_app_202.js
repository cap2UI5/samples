// @keywords wizard step branching discardprogress setnextstep control_by_id
// @summary Drives a Wizard from the backend: setting the next step and discarding progress by ID, which is how a branching wizard is steered.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/frontend
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_202.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_202", class {

  next_step = "";

  view_display(client) {

    let lr_view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    lr_view        = lr_view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Control Behaviour - Wizard with Steps" })
            .a({ n: "showNavButton",  b: client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: client._event_nav_app_leave() })
            .a({ n: "id",             v: "page_main" });

    lr_view.tag("MessageStrip")
        .a({ n: "text",     v: "A sap.m.Wizard guides through numbered steps. Branching is enabled: " +
                   "step 2 offers two follow-up steps, and the button pressed there picks " +
                   "the branch - the backend calls discardProgress and setNextStep by id " +
                   "(follow_up_action with cs_event-control_by_id)." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const lr_wizard = lr_view.ele("Wizard")
        .a({ n: "id",              v: "wiz" })
        .a({ n: "enableBranching", b: true });
    const lr_wiz_step1 = lr_wizard.ele("WizardStep")
        .a({ n: "title",     v: "STEP1" })
        .a({ n: "validated", b: true })
        .a({ n: "nextStep",  v: "STEP2" });
    lr_wiz_step1.tag("MessageStrip")
        .a({ n: "text", v: "STEP1" });

    const lr_wiz_step2 = lr_wizard.ele("WizardStep")
        .a({ n: "id",              v: "STEP2" })
        .a({ n: "title",           v: "STEP2" })
        .a({ n: "validated",       b: true })
        .a({ n: "subsequentSteps", v: "STEP22, STEP23" });

    lr_wiz_step2.tag("MessageStrip")
        .a({ n: "text", v: "STEP2" });
    lr_wiz_step2.tag("Button")
        .a({ n: "press", v: client._event("STEP22") })
        .a({ n: "text",  v: "Press Step 2.2" });
    lr_wiz_step2.tag("Button")
        .a({ n: "press", v: client._event("STEP23") })
        .a({ n: "text",  v: "Press Step 2.3" });

    const lr_wiz_step22 = lr_wizard.ele("WizardStep")
        .a({ n: "id",        v: "STEP22" })
        .a({ n: "title",     v: "STEP2.2" })
        .a({ n: "validated", b: true });

    lr_wiz_step22.tag("MessageStrip")
        .a({ n: "text", v: "STEP22" });

    const lr_wiz_step23 = lr_wizard.ele("WizardStep")
        .a({ n: "id",        v: "STEP23" })
        .a({ n: "title",     v: "STEP2.3" })
        .a({ n: "validated", b: true });

    lr_wiz_step23.tag("MessageStrip")
        .a({ n: "text", v: "STEP23" });

    const lr_wiz_step3 = lr_wizard.ele("WizardStep")
        .a({ n: "title",     v: "STEP3" })
        .a({ n: "validated", b: true });

    lr_wiz_step3.tag("MessageStrip")
        .a({ n: "text", v: "STEP3" });

    client.view_display(lr_view.stringify());

    // nextStep is an ASSOCIATION: no binding can carry it, and view_display( )
    // has just destroyed the slot XMLView.create rebuilds - so the branch the
    // handler picked is gone from the fresh WizardStep while NEXT_STEP still
    // describes it. Re-issuing the same call here is what makes the choice
    // survive a navigation back, a draft restore or any later redisplay.
    if (this.next_step !== "") {
      client.follow_up_action({
          val:   z2ui5_if_client.cs_event.control_by_id,
          t_arg: [ "STEP2", "setNextStep", this.next_step ] });
    }

  }

  main(client) {

    if (client.check_on_navigated()) {
      this.view_display(client);
    } else if (client.check_on_event("STEP22") || client.check_on_event("STEP23")) {

      // the original wizard flow (discardProgress + setNextStep) as two
      // generic whitelisted control calls - t_arg is positional:
      // id, method, params (the step params are control ids; the view
      // defaults to cs_view-main)
      this.next_step = client.get_event();
      client.follow_up_action({
          val:   z2ui5_if_client.cs_event.control_by_id,
          t_arg: [ "wiz", "discardProgress", "STEP2" ] });
      client.follow_up_action({
          val:   z2ui5_if_client.cs_event.control_by_id,
          t_arg: [ "STEP2", "setNextStep", this.next_step ] });
    }

  }
});
