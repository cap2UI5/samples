// @keywords routing hash url page browser back forward history deep link reload hash_set hash_replace hash_back hash_attach_changed navcontainer router onnavback follow_up_action event form
// @summary The whole hash_* family in one app: hash_set pushes #/detail, hash_replace rewrites it in place, hash_back steps back like a router, a deep link restores.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/navigation/hash
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_499.clas.abap
//
// App-owned hash routing - the URL semantics of a UI5 router, 1:1, and the
// whole hash_* family (named after sap/ui/core/routing/HashChanger) in one
// place:
//
//  - the start URL carries NO hash
//  - opening the detail page writes '#/detail' via hash_set - setHash, a
//    real PUSHED history entry
//  - switching the detail variant rewrites the URL via hash_replace -
//    replaceHash, NO new entry: the browser Back button skips the variant
//    switches and returns straight to the first page
//  - the BROWSER Back/Forward buttons - and a manual edit of the hash -
//    round-trip as the event hash_attach_changed registered, and the
//    handler shows the page the live hash (get( )-s_config-hash) names;
//    the app instance is untouched, so the entered data survives
//  - the in-app back button is cs_event-hash_back with '/' as its
//    FALLBACK: the UI5 onNavBack pattern. Normally one real, consumed
//    window.history.go(-1) - but on a COLD deep link ('#/detail' opened
//    fresh) there is no in-app step to take, so the fallback replaces to
//    the start page instead of falling out of the app
//  - a reload or a shared link with '#/detail' lands on the detail page
//  - hash_set( ) and hash_replace( ) have an EVENT form, follow_up_action
//    with cs_event-hash_set / cs_event-hash_replace: the same write, for an
//    app that keeps its follow-ups in one shape. The start-page button on
//    the detail page uses the first, the repair of an unknown variant in
//    the hash the second
//
// The draft-based routing modes (cs_event-hash_routing) are the siblings
// z2ui5_cl_smp_app_468 and z2ui5_cl_smp_app_480. Replaces the former
// z2ui5_cl_smp_app_322, which pushed a suffix past the UI5 HashChanger and
// had to reach for raw JavaScript to step back.
import { defineApp, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "cap2ui5";

defineApp("Z2UI5_CL_SMP_APP_499", class {

  quantity = "";
  variant  = "a";

  check_detail = false;

  main(client) {

    this.client = client;

    if (client.check_on_navigated()) {
      this.view_display();

    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  view_display() {

    // a deep link / reload: the live hash rides in s_config-hash on every
    // request, so a render whose hash already names the detail page starts
    // there - the routeMatched of a cold start
    this.hash_apply();

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:form",   v: "sap.ui.layout.form" });
    const nav = view.ele("Shell")
        .ele("NavContainer")
            .a({ n: "id", v: "nav" });

    const main = nav.ele("Page")
        .a({ n: "id",             v: "page-main" })
        .a({ n: "title",          v: "abap2UI5 - Hash - App-Owned Routing (#/detail)" })
        .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
        .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    main.tag("MessageStrip")
        .a({ n: "text",     v: "The URL has no hash right now. Type something, open the detail page and watch " +
                   "the address bar: hash_set writes #/detail, and the BROWSER Back button returns here " +
                   "- with the input still set." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    const form = main.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "Some state" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" });

    form.tag("Label")
        .a({ n: "text", v: "quantity" });
    form.tag("Input")
        .a({ n: "value", v: this.client._bind("quantity") });

    form.tag("Button")
        .a({ n: "press", v: this.client._event("GO_DETAIL") })
        .a({ n: "text",  v: "open the detail page (#/detail)" })
        .a({ n: "type",  v: "Emphasized" });

    const detail = nav.ele("Page")
        .a({ n: "id",             v: "page-detail" })
        .a({ n: "title",          v: "Detail (#/detail)" })
        .a({ n: "showNavButton",  b: true })
        // the router app's nav-back, the UI5 onNavBack pattern: one real,
        // CONSUMED step back in the browser history - and on a cold deep
        // link, where no step exists, a REPLACE to the '/' fallback. Either
        // way the hash change round-trips as HASH_CHANGED below
        .a({ n: "navButtonPress", v: this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.hash_back,
                                                                 t_arg: [ "/" ] }) });

    detail.tag("MessageStrip")
        .a({ n: "text",     v: "This page is #/detail. Reload the browser or share the URL - it lands here. " +
                   "The back arrow is cs_event-hash_back with '/' as fallback: normally a real " +
                   "window.history.go(-1), and on a cold deep link a replace to the start page. " +
                   "Edit the variant in the URL to something unknown (#/detail/z) and watch it repaired." })
        .a({ n: "type",     v: "Success" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    detail.tag("Button")
        .a({ n: "press", v: this.client._event("GO_MAIN") })
        .a({ n: "text",  v: "start page, pushed as a new entry (#/)" })
        .a({ n: "class", v: "sapUiSmallMarginBegin" });

    const vform = detail.ele({ n: "SimpleForm", ns: "form" })
        .a({ n: "title",    v: "hash_replace - the URL follows, Back skips it" })
        .a({ n: "editable", b: true })
        .ele({ n: "content", ns: "form" });

    vform.tag("Label")
        .a({ n: "text", v: "variant (watch the URL - and note Back still returns to the first page)" });
    vform.ele("SegmentedButton")
        .a({ n: "selectedKey",     v: this.client._bind("variant") })
        .a({ n: "selectionChange", v: this.client._event({ val: "VARIANT", arg: "${$parameters>/item}.getKey()" }) })
        .ele("items")
            .tag("SegmentedButtonItem")
                .a({ n: "key",  v: "a" })
                .a({ n: "text", v: "Variant A" })
            .tag("SegmentedButtonItem")
                .a({ n: "key",  v: "b" })
                .a({ n: "text", v: "Variant B" })
            .tag("SegmentedButtonItem")
                .a({ n: "key",  v: "c" })
                .a({ n: "text", v: "Variant C" })
        .end()
    .end();

    detail.tag("ObjectStatus")
        .a({ n: "text",  v: this.client._bind("quantity") })
        .a({ n: "title", v: "quantity from the first page" })
        .a({ n: "class", v: "sapUiSmallMargin" });

    this.client.view_display(view.stringify());

    // hash changes the app did not write itself (browser Back/Forward, a
    // manual edit) round-trip as HASH_CHANGED - registered per render, since
    // the registration dies with an app switch
    this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.hash_attach_changed,
                              t_arg: [ "HASH_CHANGED" ] });

    // a rebuilt NavContainer is back on its first page while check_detail
    // survives as class state - re-issue the page it should show
    if (this.check_detail === true) {
      this.client.follow_up_action({ val:   this.client.cs_event.control_by_id,
                                t_arg: [ "nav", "to", "page-detail" ] });
    }

  }

  on_event() {

    switch (this.client.get_event()) {

      case "GO_DETAIL":
        // the router's navTo: switch the page and PUSH the app-owned hash -
        // a real history entry, so the browser Back button has a step to take
        this.check_detail = true;
        this.client.follow_up_action({ val:   this.client.cs_event.control_by_id,
                                  t_arg: [ "nav", "to", "page-detail" ] });
        this.client.hash_set(`/detail/${this.variant}`);
        break;

      case "GO_MAIN":
        // the EVENT form of hash_set( ): follow_up_action with
        // cs_event-hash_set writes the same field the typed method writes -
        // a pushed history entry, so Back returns to the detail page
        this.check_detail = false;
        this.client.follow_up_action({ val:   this.client.cs_event.control_by_id,
                                  t_arg: [ "nav", "to", "page-main" ] });
        this.client.follow_up_action({ val:   this.client.cs_event.hash_set,
                                  t_arg: [ "/" ] });
        break;

      case "VARIANT":
        // the router's replace-navTo: the URL follows the variant WITHOUT a
        // new history entry - Back keeps returning to the first page, not
        // through every variant ever clicked
        this.variant = this.client.get_event_arg();
        this.client.hash_replace(`/detail/${this.variant}`);
        break;

      case "HASH_CHANGED":
        // the router's routeMatched: show the page the hash now names
        this.hash_apply();

        // a hash that names a variant the app does not have (#/detail/z,
        // typed by hand) is repaired IN PLACE - the event form of
        // hash_replace( ), no history entry for the broken URL
        if (this.check_detail === true && this.client.get().s_config.hash !== `/detail/${this.variant}`) {
          this.client.follow_up_action({ val:   this.client.cs_event.hash_replace,
                                    t_arg: [ `/detail/${this.variant}` ] });
        }

        this.client.follow_up_action({ val:   this.client.cs_event.control_by_id,
                                  t_arg: [ "nav",
                                                   "to",
                                                   (this.check_detail === true ? "page-detail"
                                                             : "page-main") ] });
        break;

    }

  }

  hash_apply() {

    // '/detail' or '/detail/{variant}' - everything else is the first page
    const lv_hash = this.client.get().s_config.hash;
    this.check_detail = (lv_hash.toUpperCase().includes("/detail".toUpperCase()));
    if (this.check_detail === true) {
      const lv_variant = (lv_hash.includes(("/detail/")) ? lv_hash.slice(lv_hash.indexOf(("/detail/")) + ("/detail/").length) : "");
      if ([...lv_variant].every((c) => "abc".includes(c)) && lv_variant !== "") {
        this.variant = lv_variant;
      }
    }

  }
});
