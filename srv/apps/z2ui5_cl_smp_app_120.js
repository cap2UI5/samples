// @keywords gps position latitude longitude altitude location
// @summary Asks the browser for the device's position - latitude, longitude and altitude - and what happens when the user says no.
// @docs https://abap2ui5.github.io/docs/cookbook/device_capabilities/geolocation
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_120.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_120", class {

  longitude        = "";
  latitude         = "";
  altitude         = "";
  speed            = "";
  altitudeaccuracy = "";
  accuracy         = "";

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("GEOLOCATION_ERROR")) {
      // the Geolocation control fires `error` when the position cannot be
      // read; the code (1 = permission denied, 2 = position unavailable,
      // 3 = timeout) and message are passed as event arguments.
      client.message_box_display({
          text: `Location unavailable (${client.get_event_arg(1)}): ${client.get_event_arg(2)}`,
          type: "error" });
    }

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" })
            .a({ n: "xmlns:z2ui5",  v: "z2ui5.cc" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Device - Geolocation from the Browser" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text", v: "The geolocation custom control reads the device position from the browser and binds " +
                   "longitude, latitude, altitude, accuracy and speed into the read-only form below." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.tag({ n: "Geolocation", ns: "z2ui5" })
        // the position arrives with the roundtrip and the view re-renders with it
        .a({ n: "finished", v: this.client._event("GEOLOCATION_LOADED") })
        .a({ n: "error",    v: this.client._event({ val:   "GEOLOCATION_ERROR",
                                                                           t_arg: [ "${$parameters>/code}",
                                                                                            "${$parameters>/message}" ] }) })
        .a({ n: "longitude",        v: this.client._bind("longitude") })
        .a({ n: "latitude",         v: this.client._bind("latitude") })
        .a({ n: "altitude",         v: this.client._bind("altitude") })
        .a({ n: "accuracy",         v: this.client._bind("accuracy") })
        .a({ n: "altitudeAccuracy", v: this.client._bind("altitudeaccuracy") })
        .a({ n: "speed",            v: this.client._bind("speed") })
        .ele({ n: "SimpleForm", ns: "form" })
            .a({ n: "title",    v: "Geolocation" })
            .a({ n: "editable", b: false })
            .ele({ n: "content", ns: "form" })
                .tag("Label")
                    .a({ n: "text",     v: "Longitude" })
                .tag("Input")
                    .a({ n: "editable", b: false })
                    .a({ n: "value",    v: this.client._bind("longitude") })
                .tag("Label")
                    .a({ n: "text",     v: "Latitude" })
                .tag("Input")
                    .a({ n: "editable", b: false })
                    .a({ n: "value",    v: this.client._bind("latitude") })
                .tag("Label")
                    .a({ n: "text",     v: "Altitude" })
                .tag("Input")
                    .a({ n: "editable", b: false })
                    .a({ n: "value",    v: this.client._bind("altitude") })
                .tag("Label")
                    .a({ n: "text",     v: "Accuracy" })
                .tag("Input")
                    .a({ n: "editable", b: false })
                    .a({ n: "value",    v: this.client._bind("accuracy") })
                .tag("Label")
                    .a({ n: "text",     v: "AltitudeAccuracy" })
                .tag("Input")
                    .a({ n: "editable", b: false })
                    .a({ n: "value",    v: this.client._bind("altitudeaccuracy") })
                .tag("Label")
                    .a({ n: "text",     v: "Speed" })
                .tag("Input")
                    .a({ n: "editable", b: false })
                    .a({ n: "value",    v: this.client._bind("speed") });

    this.client.view_display(view.stringify());

  }
});
