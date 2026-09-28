# cap2UI5 samples

The [abap2UI5 samples](https://github.com/abap2UI5/samples) as
[cap2UI5](https://github.com/cap2UI5/cap2UI5) apps: every sample a plain
JavaScript class in `srv/apps/`, in an ordinary CAP project.

> [!NOTE]
> **Status: first examples.** Nine of the 129 apps are ported, to agree on the
> conventions below before the rest follows.

## Run

```bash
npm install
npm run watch        # cds watch - prints the address of every sample
npm test             # every sample driven over the wire against the published cap2ui5
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

| abap2UI5 | cap2UI5 |
|---|---|
| `DATA name TYPE string.` | `name = "";` - the initial value is the type |
| `DATA t_tab TYPE STANDARD TABLE OF ty_s_row` | `t_tab = t.table({ …one row… });` |
| `client->check_on_init( )` | `c.isFirstRun` - seed state here |
| `client->check_on_navigated( )` | `c.isDisplay` - render here |
| `client->check_on_event( 'X' )`, `get_event( )` | `c.eventName === "X"` |
| `client->_bind( name )` | `c.bind("name")` - the field's **name** |
| `client->_event( val = 'X' t_arg = … )` | `c.event("X", [ … ])` |
| `client->get_event_arg( 1 )` | `c.eventArg(1)` |
| `z2ui5_cl_ui5_view_builder` chain | an XML template literal |
| `client->view_display( )`, `popup_display( )` | `c.view( )`, `c.popup( )` |
| `client->check_app_prev_stack( )` | `c.canGoBack` |
| `client->_event_nav_app_leave( )` | `c.event("BACK")`, answered with `c.navBack( )` |
| `client->nav_app_call( NEW z…( ) )` | `c.navTo("Z…")` |
| `client->get_app_prev( )` | `c.prevApp` - the other app's fields as plain values |

The page title says `cap2UI5 - …`, and the explaining texts name the
JavaScript API, not the ABAP one.

### Four things that differ from ABAP

1. **`this` reads plain copies.** Assign to write:
   `this.t_tab = [...this.t_tab, row]`. A `push` on the copy is lost.
2. **A table field starts empty**, whatever rows its initializer lists:
   declare it with `t.table({ …one row… })` and seed it in `c.isFirstRun`.
   Scalars and structures keep their initial values.
3. **Helpers are functions, not methods.** In `cap2ui5` 0.1.0 a method called
   from `main( )` sees the framework's ABAP boxes instead of the values, so
   the view is built by a module function that gets `c` and the app:
   `c.view(view(c, this))`.
4. **The render branch comes first.** A called app that returns arrives with
   `c.isDisplay` *and* its event name set; `if (c.isDisplay) … else if
   (c.eventName === …)` keeps the two apart.

### What the facade does not have yet

`c` covers what 39 of the 129 samples use; six more need only a small
adaptation (a structure's components bound relatively inside
`binding="${c.bind("s")}"`, as in `Z2UI5_CL_SMP_APP_488`). The rest need
parts of `z2ui5_if_client` the facade does not wrap yet - above all
`follow_up_action( )` (47 samples), then `popover_display( )`, `get( )`, and
the options of `_bind( )`, `_event( )` and `message_box_display( )`.

Until it does, every one of them is reachable through `c.raw`, the transpiled
`z2ui5_if_client` - asynchronous and with ABAP-typed arguments, as
`Z2UI5_CL_SMP_APP_125` shows.
