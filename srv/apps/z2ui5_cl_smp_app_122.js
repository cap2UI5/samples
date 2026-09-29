// @keywords client info ui5 version theme os user agent device cs_device browser orientation constants
// @summary Asks the frontend what it is: UI5 version, theme, operating system, browser and user agent, in one call.
// @docs https://abap2ui5.github.io/docs/cookbook/device_capabilities/info
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_122.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_122", class {

  ui5_version            = "";
  ui5_theme              = "";
  ui5_gav                = "";
  ui5_build_timestamp    = "";
  device_systemtype      = "";
  device_os              = "";
  device_os_version      = "";
  device_browser         = "";
  device_browser_version = "";
  device_orientation     = "";
  device_phone           = false;
  device_desktop         = false;
  device_tablet          = false;
  device_combi           = false;
  device_touch           = false;
  device_pointer         = false;
  device_retina          = false;
  device_height          = "";
  device_width           = "";
  browser_label          = "";
  os_label               = "";
  orientation_label      = "";

  read_frontend_info() {

    const ls_get = this.client.get();

    this.device_browser         = ls_get.s_device.browser.name;
    this.device_browser_version = ls_get.s_device.browser.version;
    this.device_os              = ls_get.s_device.os.name;
    this.device_os_version      = ls_get.s_device.os.version;
    this.device_systemtype      = ls_get.s_device.system;
    this.device_orientation     = ls_get.s_device.orientation;
    this.device_height          = String(ls_get.s_device.resize.height);
    this.device_width           = String(ls_get.s_device.resize.width);
    this.device_phone           = (ls_get.s_device.system === z2ui5_if_client.cs_device.system.phone);
    this.device_desktop         = (ls_get.s_device.system === z2ui5_if_client.cs_device.system.desktop);
    this.device_tablet          = (ls_get.s_device.system === z2ui5_if_client.cs_device.system.tablet);
    this.device_combi           = (ls_get.s_device.system === z2ui5_if_client.cs_device.system.combi);
    this.device_touch           = ls_get.s_device.support.touch;
    this.device_pointer         = ls_get.s_device.support.pointer;
    this.device_retina          = ls_get.s_device.support.retina;
    this.ui5_version            = ls_get.s_ui5.version;
    this.ui5_theme              = ls_get.s_ui5.theme;
    this.ui5_gav                = ls_get.s_ui5.gav;
    this.ui5_build_timestamp    = ls_get.s_ui5.build_timestamp;

    // the raw values are short codes (cr, ff, win, mac, ...). cs_device
    // names every one of them, so an app branches on the constant rather
    // than on a string it would have to know - here into a label per group
    this.browser_label = (ls_get.s_device.browser.name === z2ui5_if_client.cs_device.browser.chrome ? "Google Chrome (or Chromium)"
                              : ls_get.s_device.browser.name === z2ui5_if_client.cs_device.browser.firefox ? "Mozilla Firefox"
                              : ls_get.s_device.browser.name === z2ui5_if_client.cs_device.browser.safari ? "Apple Safari"
                              : ls_get.s_device.browser.name === z2ui5_if_client.cs_device.browser.edge ? "Microsoft Edge"
                              : "not one cs_device-browser names");
    this.os_label      = (ls_get.s_device.os.name === z2ui5_if_client.cs_device.os.windows ? "Windows"
                              : ls_get.s_device.os.name === z2ui5_if_client.cs_device.os.macintosh ? "macOS"
                              : ls_get.s_device.os.name === z2ui5_if_client.cs_device.os.linux ? "Linux"
                              : ls_get.s_device.os.name === z2ui5_if_client.cs_device.os.ios ? "iOS"
                              : ls_get.s_device.os.name === z2ui5_if_client.cs_device.os.android ? "Android"
                              : "not one cs_device-os names");
    this.orientation_label = (ls_get.s_device.orientation === z2ui5_if_client.cs_device.orientation.portrait ? "portrait - one column would fit best"
                                  : ls_get.s_device.orientation === z2ui5_if_client.cs_device.orientation.landscape ? "landscape - room for two columns"
                                  : "not one cs_device-orientation names");

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Device - Frontend Info: UI5 Version, Theme, OS, Browser" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Reads frontend information from the client - UI5 version and theme plus device, " +
                   "OS and browser details - and shows each value in a read-only form. The three labels " +
                   "are decided with the cs_device constants, the way an app would branch on them." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Information" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" })
            .tag("Label")
                .a({ n: "text", v: "device_browser" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_browser") })
            .tag("Label")
                .a({ n: "text", v: "device_browser_version" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_browser_version") })
            .tag("Label")
                .a({ n: "text", v: "device_os" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_os") })
            .tag("Label")
                .a({ n: "text", v: "device_os_version" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_os_version") })
            .tag("Label")
                .a({ n: "text", v: "device_systemtype" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_systemtype") })
            .tag("Label")
                .a({ n: "text", v: "device_orientation" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_orientation") })
            .tag("Label")
                .a({ n: "text", v: "browser, by cs_device-browser" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("browser_label") })
            .tag("Label")
                .a({ n: "text", v: "os, by cs_device-os" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("os_label") })
            .tag("Label")
                .a({ n: "text", v: "orientation, by cs_device-orientation" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("orientation_label") })
            .tag("Label")
                .a({ n: "text", v: "device_height" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_height") })
            .tag("Label")
                .a({ n: "text", v: "device_width" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_width") })
            .tag("Label")
                .a({ n: "text", v: "device_phone" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_phone") })
            .tag("Label")
                .a({ n: "text", v: "device_desktop" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_desktop") })
            .tag("Label")
                .a({ n: "text", v: "device_tablet" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_tablet") })
            .tag("Label")
                .a({ n: "text", v: "device_combi" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_combi") })
            .tag("Label")
                .a({ n: "text", v: "device_touch" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_touch") })
            .tag("Label")
                .a({ n: "text", v: "device_pointer" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_pointer") })
            .tag("Label")
                .a({ n: "text", v: "device_retina" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("device_retina") })
            .tag("Label")
                .a({ n: "text", v: "ui5_version" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("ui5_version") })
            .tag("Label")
                .a({ n: "text", v: "ui5_theme" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("ui5_theme") })
            .tag("Label")
                .a({ n: "text", v: "ui5_gav" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("ui5_gav") })
            .tag("Label")
                .a({ n: "text", v: "ui5_build_timestamp" })
            .tag("Input")
                .a({ n: "enabled", b: false })
                .a({ n: "value",   v: this.client._bind("ui5_build_timestamp") });
    this.client.view_display(view.stringify());

  }

  main(client) {

    this.client = client;
    if (client.check_on_init()) {

      this.read_frontend_info();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();

    }

  }
});
