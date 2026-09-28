# cap2UI5 samples

The [abap2UI5 samples](https://github.com/abap2UI5/samples) as
[cap2UI5](https://github.com/cap2UI5/cap2UI5) apps: every sample a plain
JavaScript class in `srv/apps/`, in an ordinary CAP project - and line for
line the ABAP original. The client is abap2UI5's `z2ui5_if_client` by its own
names, the view is built with `z2ui5_cl_ui5_view_builder`, called the way ABAP
calls it: `client->check_app_prev_stack( )` is
`client.check_app_prev_stack()`.

> [!NOTE]
> **Status: first examples.** Nine of the 129 apps are ported, to agree on the
> conventions below before the rest follows. They need **cap2ui5 0.2.0**,
> which is not on npm yet (the client under its ABAP names and the view
> builder are in its `Unreleased` changelog). Until it is, a plain
> `npm install` answers `ETARGET`; install the plugin packed from a cap2UI5
> checkout instead, which brings the other dependencies along:
>
> ```bash
> (cd ../cap2UI5 && scripts/assemble-runtime.sh --package 1.145.0 && npm install \
>   && npm pack --workspace plugin --pack-destination /tmp)
> npm install --no-save /tmp/cap2ui5-*.tgz
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
| Basics III - Lifecycle: Init, Event, Navigated | [`Z2UI5_CL_SMP_APP_495`](srv/apps/z2ui5_cl_smp_app_495.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_495.clas.abap) |
| Table - Editable Cells, Add and Delete Rows | [`Z2UI5_CL_SMP_APP_011`](srv/apps/z2ui5_cl_smp_app_011.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_011.clas.abap) |
| Event - Extra Arguments with t_arg | [`Z2UI5_CL_SMP_APP_167`](srv/apps/z2ui5_cl_smp_app_167.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_167.clas.abap) |
| Popup - Dialog inside a Dialog | [`Z2UI5_CL_SMP_APP_161`](srv/apps/z2ui5_cl_smp_app_161.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_161.clas.abap) |
| Navigation - Return Data and Events to the Caller | [`Z2UI5_CL_SMP_APP_488`](srv/apps/z2ui5_cl_smp_app_488.js) (+ [`_489`](srv/apps/z2ui5_cl_smp_app_489.js)) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_488.clas.abap) |
| Browser - Set the Tab Title | [`Z2UI5_CL_SMP_APP_125`](srv/apps/z2ui5_cl_smp_app_125.js) | [abap](https://github.com/abap2UI5/samples/blob/main/src/z2ui5_cl_smp_app_125.clas.abap) |

## How a sample is ported

**1:1, so that it is recognized at a glance.** Put the ABAP original and the
port side by side and every line has its counterpart:

- **One ABAP class, one file, the same name.** `z2ui5_cl_smp_app_493.clas.abap`
  becomes `srv/apps/z2ui5_cl_smp_app_493.js`, registered as
  `Z2UI5_CL_SMP_APP_493` - so `?app_start=` is the same on both sides, a
  sample that calls another one keeps calling it by its name. The header
  keeps the original's `@keywords`, `@summary` and `@docs`, and `@origin`
  points back at it.
- **The same class.** The same attributes under the same names, the same
  methods (`view_display( )`, `on_event( )`, …) in the same order, the same
  dispatcher in `main( )`, `me->client = client` as `this.client = client`.
- **The same calls.** The client's methods and the view builder's are the ABAP
  ones; a method's preferred parameter is its one positional argument and
  parameters by name are one object with the ABAP names. The view keeps the
  original's tree and layout: one call per line, four spaces per tree level,
  `end()` in the column of the `ele()` it closes, the `v =` column aligned.
- **The same texts.** Only the page title says `cap2UI5 - …`, and a text that
  names an ABAP construct (`z2ui5_if_app`, `client->…`) names the JavaScript
  one.

| abap2UI5 | cap2UI5 |
|---|---|
| `DATA name TYPE string.` | `name = "";` - the initial value is the type |
| `DATA t_tab TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.` | `t_tab = t.table({ …one row… });` |
| `METHOD z2ui5_if_app~main.` | `main(client) {` |
| `me->client = client.` / `client->…` in a method | `this.client = client;` / `this.client.…` |
| `IF client->check_on_navigated( ).` | `if (client.check_on_navigated()) {` |
| `client->_bind( name )`, `client->_bind( s_result-product )` | `client._bind("name")`, `client._bind("s_result-product")` |
| `client->_bind( val = t_tab path = abap_true )` | `client._bind({ val: "t_tab", path: true })` |
| ``client->_event( val = `X` arg = `…` )`` | `client._event({ val: "X", arg: "…" })` |
| ``z2ui5_cl_ui5_view_builder=>factory( )->ele( n = `View` ns = `mvc` )`` | `z2ui5_cl_ui5_view_builder.factory().ele({ n: "View", ns: "mvc" })` |
| ``)->a( n = `title` v = `…` )``, `b = abap_true`, `t = …` | `.a({ n: "title", v: "…" })`, `b: true`, `t: …` |
| `client->view_display( view->stringify( ) ).` | `client.view_display(view.stringify());` |
| `z2ui5_if_client=>cs_event-set_title` | `z2ui5_if_client.cs_event.set_title` |
| `client->nav_app_call( NEW z2ui5_cl_smp_app_493( ) )` | `client.nav_app_call("Z2UI5_CL_SMP_APP_493")` |
| `client->nav_app_leave( event = … r_data = … )` | `client.nav_app_leave({ event: …, r_data: … })` |
| `ASSIGN client->get( )-r_event_data->* TO …` | `client.get().r_event_data` - the data itself |
| ``CASE client->get_event( ). WHEN `A` OR `B`.`` | `switch (client.get_event()) { case "A": case "B":` |

### What differs from ABAP

1. **A field is bound by its name**, `client._bind("name")`: ABAP's `_bind( )`
   finds the attribute by reference, which a JavaScript value cannot carry.
2. **`this` reads plain copies.** Assign to write:
   `this.t_tab = [...this.t_tab, row]` for `INSERT … INTO TABLE t_tab`. A
   `push` on the copy is lost. Assigning an object replaces a structure, so
   `this.s_result = {}` is `s_result = VALUE #( )`.
3. **Every field is part of the model.** ABAP keeps a `PROTECTED` attribute out
   of it; a JavaScript field with an initial value is always bound. The client
   is the exception: assigned in `main( )` and not declared, it stays out.
