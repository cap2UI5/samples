# cap2UI5 samples

The [abap2UI5 samples](https://github.com/abap2UI5/samples) as
[cap2UI5](https://github.com/cap2UI5/cap2UI5) apps: every sample a plain
JavaScript class in `srv/apps/`, in an ordinary CAP project, its view built
with `ViewBuilder` - abap2UI5's own view builder - call for call as the ABAP
original builds it.

> [!NOTE]
> **Status: first examples.** Nine of the 129 apps are ported, to agree on the
> conventions below before the rest follows. They need **cap2ui5 0.2.0**,
> which is not on npm yet (`ViewBuilder` and the facade members the samples
> use are in its `Unreleased` changelog). Until it is, install the plugin from
> a cap2UI5 checkout:
>
> ```bash
> (cd ../cap2UI5 && scripts/assemble-runtime.sh --package 1.145.0 && npm install \
>   && npm pack --workspace plugin --pack-destination /tmp)
> npm install && npm install --no-save /tmp/cap2ui5-*.tgz
> ```

## Run

```bash
npm install
npm run watch        # cds watch - prints the address of every sample
npm test             # every sample driven over the wire
```

Log in as `alice` with an empty password (CAP's mocked development user), then
open e.g. <http://localhost:4004/sap/bc/z2ui5?app_start=Z2UI5_CL_SMP_APP_493>.

## The samples so far

| Sample | App | ABAP original |
|---|---|---|
| Basics I - Hello World, the Smallest App | [`Z2UI5_CL_SMP_APP_493`](srv/apps/z2ui5_cl_smp_app_493.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_493.clas.abap) |
| Basics II - Data Binding: Input and Button | [`Z2UI5_CL_SMP_APP_494`](srv/apps/z2ui5_cl_smp_app_494.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_494.clas.abap) |
| Basics III - Lifecycle: First Run, Event, Display | [`Z2UI5_CL_SMP_APP_495`](srv/apps/z2ui5_cl_smp_app_495.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_495.clas.abap) |
| Table - Editable Cells, Add and Delete Rows | [`Z2UI5_CL_SMP_APP_011`](srv/apps/z2ui5_cl_smp_app_011.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_011.clas.abap) |
| Event - Extra Arguments with the Event | [`Z2UI5_CL_SMP_APP_167`](srv/apps/z2ui5_cl_smp_app_167.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_167.clas.abap) |
| Popup - Dialog inside a Dialog | [`Z2UI5_CL_SMP_APP_161`](srv/apps/z2ui5_cl_smp_app_161.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_161.clas.abap) |
| Navigation - Return Data and Events to the Caller | [`Z2UI5_CL_SMP_APP_488`](srv/apps/z2ui5_cl_smp_app_488.js) (+ [`_489`](srv/apps/z2ui5_cl_smp_app_489.js)) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_488.clas.abap) |
| Browser - Set the Tab Title (A) | [`Z2UI5_CL_SMP_APP_125`](srv/apps/z2ui5_cl_smp_app_125.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_125.clas.abap) |

## How a sample is ported

**One ABAP class, one file, the same name.** `z2ui5_cl_smp_app_493.clas.abap`
becomes `srv/apps/z2ui5_cl_smp_app_493.js`, registered as
`Z2UI5_CL_SMP_APP_493` - so `?app_start=` is the same on both sides, a sample
that calls another one keeps calling it by its name, and `@origin` in the
file header points back at the original.

**The same structure.** The dispatcher is the original's `IF` / `ELSEIF`
chain, its methods keep their roles (`view_display` becomes `viewDisplay(c)`),
and the view is the original's chain with the same verbs, the same tree and
the same layout: one call per line, four spaces per tree level, `end()` in
the column of the `ele()` it closes.

| abap2UI5 | cap2UI5 |
|---|---|
| `DATA name TYPE string.` | `name = "";` - the initial value is the type |
| `DATA t_tab TYPE STANDARD TABLE OF ty_s_row` | `t_tab = t.table({ …one row… });` |
| `client->check_on_init( )` | `c.isFirstRun` - seed state here |
| `client->check_on_navigated( )` | `c.isDisplay` - render here |
| `client->check_on_event( 'X' )`, `get_event( )` | `c.eventName === "X"` |
| `z2ui5_cl_ui5_view_builder=>factory( )->ele( n = … ns = … )` | `ViewBuilder.factory().ele(n, ns)` |
| `->a( n = … v = … )` / `b = …` / `t = …` | `.a(n, "…")` / `.a(n, true)` / `.a(n, { t: … })` |
| `client->view_display( view->stringify( ) )` | `c.view(view)` |
| `client->_bind( name )`, `_bind( s_order-customer )` | `c.bind("name")`, `c.bind("s_order.customer")` |
| `client->_bind( val = t_tab path = abap_true )` | `c.bind("t_tab", { path: true })` |
| `client->_event( val = 'X' t_arg = … )` | `c.event("X", [ … ])` |
| `client->get_event_arg( 1 )` | `c.eventArg(1)` |
| `client->check_app_prev_stack( )` | `c.canGoBack` |
| `client->_event_nav_app_leave( )` | `c.eventNavBack()` |
| `client->follow_up_action( val = cs_event-set_title … )` | `c.followUpAction("set_title", [ … ])` |
| `client->nav_app_call( NEW z…( ) )` | `c.navTo("Z…")` |
| `client->nav_app_leave( event = … r_data = … )` | `c.navBack({ event, data })` |
| `client->get( )-r_event_data` | `c.eventData` |
| `client->get_app_prev( )` | `c.prevApp` - the other app's fields as plain values |

The page title says `cap2UI5 - …`, and the explaining texts name the
JavaScript API, not the ABAP one.

### What differs from ABAP

1. **`this` reads plain copies.** Assign to write:
   `this.t_tab = [...this.t_tab, row]`. A `push` on the copy is lost.
2. **Every field is part of the model.** ABAP keeps a `PROTECTED` attribute out
   of it; a JavaScript field with an initial value is always bound.
3. **The render branch comes first.** A called app that returns arrives with
   `c.isDisplay` *and* its event name set; `if (c.isDisplay) … else if
   (c.eventName === …)` keeps the two apart.
