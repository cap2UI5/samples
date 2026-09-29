// @keywords flexbox layout responsive navigation tile panel
// @summary Lays a page out with FlexBox and custom CSS classes - tiles, panels and a QuickView popover, all from the view chain.
// @docs https://abap2ui5.github.io/docs/cookbook/view/definition
// @origin abap2UI5/samples src/z2ui5_cl_smp_app_255.clas.abap
import { defineApp, z2ui5_cl_ui5_view_builder } from "@cap2ui5/cds-plugin";

defineApp("Z2UI5_CL_SMP_APP_255", class {

  view_display() {

    // the classes below exist nowhere in UI5 - they are shipped with the view
    // in the core:HTML style element and referenced by the class attribute of
    // the controls, so a page can carry its own design
    const css = ".navigationExamples .ne-flexbox1," +
                ".navigationExamples .ne-flexbox2 \\{" +
                "    padding: 0;" +
                "\\}" +
                ".navigationExamples .ne-flexbox1 li \\{" +
                "    margin: 0.4em;" +
                "    padding: 0.4em 1.3em;" +
                "    list-style-type: none;" +
                "    text-align: center;" +
                "    background-color: #193441;" +
                "    cursor: pointer;" +
                "\\}" +
                ".navigationExamples .ne-flexbox1 li:hover \\{" +
                "    background-color: orange;" +
                "\\}" +
                ".navigationExamples .ne-flexbox2 li \\{" +
                "    margin: 0.5em;" +
                "    width: 25%;" +
                "    min-width: 15%;" +
                "    list-style-type: none;" +
                "    text-align: center;" +
                "    background-color: #193441;" +
                "    padding: 0.4em;" +
                "    transition: width 0.5s ease-out, background-color 0.5s ease-out, flex-basis 0.5s ease-out;" +
                "    cursor: pointer;" +
                "\\}" +
                ".navigationExamples .ne-flexbox2 li:hover \\{" +
                "    flex-basis: 35% !important;" +
                "    background-color: orange;" +
                "\\}" +
                ".navigationExamples .ne-flexbox1 li a," +
                ".navigationExamples .ne-flexbox2 li a \\{" +
                "    color: #fff;" +
                "    text-decoration: none;" +
                "    font-size: 0.875rem;" +
                "\\}";

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "displayBlock", v: "true" })
            .a({ n: "height",       v: "100%" })
            .a({ n: "xmlns",        v: "sap.m" })
            .a({ n: "xmlns:mvc",    v: "sap.ui.core.mvc" })
            .a({ n: "xmlns:core",   v: "sap.ui.core" });
    // raw markup travels in the content attribute of a core:HTML leaf - the
    // builder re-escapes it on stringify, so the literal markup is written here
    view.tag({ n: "HTML", ns: "core" })
        .a({ n: "content", v: "<style>" + css + "</style>" });

    const page = view.ele("Shell")
        .ele("Page")
            .a({ n: "title",          v: "abap2UI5 - CSS - FlexBox Layouts with Custom Classes" })
            .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
            .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("MessageStrip")
        .a({ n: "text",     v: "Navigation layouts built with sap.m.FlexBox and CSS classes of this app's own: the " +
                   "stylesheet travels with the view, the controls name the classes. Variable width, equal width " +
                   "with a transition effect - the hint button in the header explains the panels." })
        .a({ n: "type",     v: "Information" })
        .a({ n: "showIcon", b: true })
        .a({ n: "class",    v: "sapUiSmallMargin" });

    page.ele("headerContent")
        .tag("Button")
            .a({ n: "press",   v: this.client._event("POPOVER") })
            .a({ n: "icon",    v: "sap-icon://hint" })
            .a({ n: "id",      v: "hint_icon" })
            .a({ n: "tooltip", v: "Sample information" });

    page.ele("VBox")
        .a({ n: "class", v: "navigationExamples" })
        .ele("Panel")
            .a({ n: "headerText", v: "Variable width" })
            .ele("FlexBox")
                .a({ n: "class",          v: "ne-flexbox1" })
                .a({ n: "renderType",     v: "List" })
                .a({ n: "alignItems",     v: "Center" })
                .a({ n: "justifyContent", v: "Center" })
                .ele({ n: "HTML", ns: "core" })
                    .a({ n: "content", v: "<a >Item 1</a>" })
                .end()
                .ele({ n: "HTML", ns: "core" })
                    .a({ n: "content", v: "<a >Long item 2</a>" })
                .end()
                .ele({ n: "HTML", ns: "core" })
                    .a({ n: "content", v: "<a >Item 3</a>" })
                .end()
            .end()
            .ele("Panel")
                .a({ n: "headerText", v: "Same width, transition effect" })
                .ele("FlexBox")
                    .a({ n: "class",          v: "ne-flexbox2" })
                    .a({ n: "renderType",     v: "List" })
                    .a({ n: "alignItems",     v: "Center" })
                    .a({ n: "justifyContent", v: "SpaceBetween" })
                    .ele({ n: "HTML", ns: "core" })
                        .a({ n: "content", v: "<a >Item 1</a>" })
                        .ele({ n: "layoutData", ns: "core" })
                            .tag("FlexItemData")
                                .a({ n: "growFactor", v: "1" })
                                .a({ n: "baseSize",   v: "25%" })
                        .end()
                    .end()
                    .ele({ n: "HTML", ns: "core" })
                        .a({ n: "content", v: "<a >Long item 2</a>" })
                        .ele({ n: "layoutData", ns: "core" })
                            .tag("FlexItemData")
                                .a({ n: "growFactor", v: "1" })
                                .a({ n: "baseSize",   v: "25%" })
                        .end()
                    .end()
                    .ele({ n: "HTML", ns: "core" })
                        .a({ n: "content", v: "<a >Item 3</a>" })
                        .ele({ n: "layoutData", ns: "core" })
                            .tag("FlexItemData")
                                .a({ n: "growFactor", v: "1" })
                                .a({ n: "baseSize",   v: "25%" })
                        .end()
                    .end();

    this.client.view_display(view.stringify());

  }

  popover_display(id) {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "FragmentDefinition", ns: "core" })
            .a({ n: "xmlns",      v: "sap.m" })
            .a({ n: "xmlns:core", v: "sap.ui.core" });
    view.ele("QuickView")
        .a({ n: "placement", v: "Bottom" })
        .a({ n: "width",     v: "auto" })
        .ele("QuickViewPage")
            .a({ n: "description", v: "The items are list entries in a FlexBox; the classes that shape and colour them " +
                                        "are defined in the style element this view ships, not in the UI5 theme." })
            .a({ n: "header",      v: "Sample information" })
            .a({ n: "pageId",      v: "sampleInformationId" });

    this.client.popover_display({ xml: view.stringify(), by_id: id });

  }

  main(client) {

    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event("POPOVER")) {
      this.popover_display("hint_icon");
    }

  }
});
