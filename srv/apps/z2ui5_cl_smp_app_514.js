// @keywords carousel aggregation item index clone template setactivepage positional control_by_id
// @summary Jumps a Carousel to a page that was cloned from a bound template - addressed positionally as id/aggregation/index, the only way to reach a clone.
// @docs https://abap2ui5.github.io/docs/cookbook/event_navigation/frontend
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_514.clas.abap
import { defineApp, t, z2ui5_cl_ui5_view_builder, z2ui5_if_client } from "cap2ui5";

const ty_s_page = {
  title: "",
  text:  "",
};

defineApp("Z2UI5_CL_SMP_APP_514", class {

  t_pages = t.table(ty_s_page);

  // not bound - the index the backend last jumped to, counted from 1
  current = 0;

  main(client) {

    this.client = client;
    if (client.check_on_init()) {
      this.model_init();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  model_init() {

    this.t_pages = [ { title: "Bicycle",  text: "The first page of the carousel." },
                       { title: "Car",      text: "The second page - and the one the buttons below jump to." },
                       { title: "Train",    text: "The third page." },
                       { title: "Aircraft", text: "The fourth and last page." } ];
    this.current = 1;

  }

  page_show(index) {

    this.current = index;
    // A page of this carousel is a CLONE of the aggregation template, and a
    // clone has no id the backend can spell: UI5 mints it from the template
    // id, the parent id and the position, and the parent id carries the view
    // prefix assigned at runtime. So the item is addressed POSITIONALLY -
    // `<control id>/<aggregation>/<index>`, 0-based - which the frontend
    // resolves against the live aggregation. It is the equivalent of the UI5
    // controller idiom oCarousel.setActivePage( oCarousel.getPages()[ i ] ).
    this.client.follow_up_action({ val:   z2ui5_if_client.cs_event.control_by_id,
                              t_arg: [ "demoCarousel",
                                               "setActivePage",
                                               `demoCarousel/pages/${index - 1}` ] });

  }

  on_event() {

    switch (this.client.get_event()) {

      case "FIRST":
        this.page_show(1);
        break;

      case "NEXT":
        // wrap around at the end - the count is ABAP's, not the carousel's
        this.page_show((this.current >= this.t_pages.length ? 1 : this.current + 1));
        break;

      case "LAST":
        this.page_show(this.t_pages.length);
        break;

    }

  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - Control Behaviour - Aggregation Item by Index" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "The carousel pages are clones of a bound template, so none of them has an id the backend " +
                   "could name. Wherever a control call takes a control id it also takes an aggregation item, written " +
                   "id/aggregation/index and counted from 0." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("HBox")
        .a({ n: "class", v: "sapUiSmallMargin" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("FIRST") })
            .a({ n: "text",  v: "First" })
            .a({ n: "icon",  v: "sap-icon://close-command-field" })
            .a({ n: "class", v: "sapUiTinyMarginEnd" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("NEXT") })
            .a({ n: "text",  v: "Next" })
            .a({ n: "icon",  v: "sap-icon://navigation-right-arrow" })
            .a({ n: "class", v: "sapUiTinyMarginEnd" })
        .tag("Button")
            .a({ n: "press", v: this.client._event("LAST") })
            .a({ n: "text",  v: "Last" })
            .a({ n: "icon",  v: "sap-icon://open-command-field" });

    page.ele("Carousel")
        .a({ n: "id",     v: "demoCarousel" })
        .a({ n: "height", v: "20rem" })
        .a({ n: "pages",  v: this.client._bind("t_pages") })
        .a({ n: "class",  v: "sapUiSmallMargin" })
        .ele("pages")
            .ele("VBox")
                .a({ n: "justifyContent", v: "Center" })
                .a({ n: "alignItems",     v: "Center" })
                .a({ n: "height",         v: "100%" })
                .tag("Title")
                    .a({ n: "text",  v: "{TITLE}" })
                    .a({ n: "level", v: "H2" })
                .tag("Text")
                    .a({ n: "text",  v: "{TEXT}" })
                    .a({ n: "class", v: "sapUiSmallMarginTop" });

    this.client.view_display(view.stringify());

    // The active page is live control state that no binding carries: this
    // response destroys the view slot and the frontend rebuilds the control
    // tree, so the carousel comes back on its first page while `current`
    // survives in ABAP. Re-issuing the call from here - after the view that
    // will hold it - is what keeps the two in step across a rebuild.
    this.page_show(this.current);

  }
});
