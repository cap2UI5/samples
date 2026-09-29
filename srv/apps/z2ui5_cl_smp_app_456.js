// @keywords planningcalendar appointment javascript date object iso
// @summary Appointments in a PlanningCalendar: start and end as date objects, which is what the control binds against.
// @docs https://abap2ui5.github.io/docs/cookbook/model/formatter
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_456.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

const ty_s_appointment = {
  start_at: "",
  end_at:   "",
  title:    "",
  type:     "",
};

const ty_s_person = {
  name:           "",
  t_appointments: t.table(ty_s_appointment),
};

defineApp("Z2UI5_CL_SMP_APP_456", class {

  t_people   = t.table(ty_s_person);
  start_date = "";

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.start_date = "2026-07-20T07:00:00";
      this.t_people = [
          { name: "Anna Miller",
            t_appointments: [
                { start_at: "2026-07-20T08:00:00", end_at: "2026-07-20T09:00:00",
                  title: "Team meeting", type: "Type01" },
                { start_at: "2026-07-20T11:00:00", end_at: "2026-07-20T12:30:00",
                  title: "Customer call", type: "Type08" } ] },
          { name: "Tom Schmidt",
            t_appointments: [
                { start_at: "2026-07-20T09:30:00", end_at: "2026-07-20T10:30:00",
                  title: "Code review", type: "Type06" } ] } ];
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
            .a({ n: "xmlns:core",   v: "sap.ui.core" })
            .a({ n: "xmlns:u",      v: "sap.ui.unified" });

    // calendar date properties (CalendarAppointment startDate/endDate,
    // PlanningCalendar startDate) are typed "object" - they demand a real JS
    // Date; a plain string binding crashes view creation ("Date must be a
    // JavaScript or UI5Date date object"). Formatter.DateCreateObject from
    // the curated module converts the model's ISO strings at the point of
    // use - the model itself stays plain strings everywhere.
    view.a({ n: "core:require", v: "{Formatter: 'z2ui5/model/formatter'}" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Formatter - Date Objects for the PlanningCalendar" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "The model carries plain ISO strings; Formatter.DateCreateObject turns them into " +
                   "the real JS Date objects the object-typed calendar properties require - only at " +
                   "the bindings that need them." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    // the startDate path must come from _bind - a hardcoded binding
    // path is never registered in the model, the frontend then receives no
    // data and the formatter passes a non-Date into the object property
    page.ele("PlanningCalendar")
        .a({ n: "rows",      v: this.client._bind("t_people") })
        .a({ n: "startDate", v: `{ path: '${this.client._bind({ val: "start_date", path: true })}', ` +
                    `formatter: 'Formatter.DateCreateObject' }` })
        .a({ n: "id",        v: "PC1" })
        .a({ n: "class",     v: "sapUiSmallMargin" })
        .ele("rows")
            .ele("PlanningCalendarRow")
                .a({ n: "appointments", v: "{path: 'T_APPOINTMENTS', templateShareable: true}" })
                .a({ n: "title",        v: "{NAME}" })
                .ele("appointments")
                    .ele({ n: "CalendarAppointment", ns: "u" })
                        .a({ n: "startDate", v: "{ path: 'START_AT', formatter: 'Formatter.DateCreateObject' }" })
                        .a({ n: "endDate",   v: "{ path: 'END_AT', formatter: 'Formatter.DateCreateObject' }" })
                        .a({ n: "title",     v: "{TITLE}" })
                        .a({ n: "type",      v: "{TYPE}" });

    this.client.view_display(view.stringify());

  }
});
