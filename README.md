![Build Status](http://54.206.8.184:8080/buildStatus/icon?job=sussol-react-table-test)

# sussol-react-table
A wrapper and simple API for using the blueprintjs data table

# Installation
`yarn add sussol-react-table`

or

`npm install sussol-react-table`

# Added Options

| Prop          | Type          | Description  |
| ------------- |:-------------:| ------------ |
| `cellDataKey` | `String`      | Pass a key (object property) from your table data set as a string. The data's key will be used to access a value &ndash; the unique key. Good for selecting the table row and loading a corresponding component, based on the selected key. e.g. `{ ... code: 123456789, ...}` |
| `columns`     | `Array`| `[{ key: String, title: String, ?sortable: Boolean, ?align: "left|center|right" }]` Column headers for the table. |
| `tableData`   | `Array` | `[{ any }]` Must contain at least the valid `columns` keys. |
| `defaultColumnAlign` | `String` | `"left|center|right"` The CSS text alignment for **all** table cells. Defaults to `"left"`. A column's `align` key takes precedence. |
| `defaultSortKey` | `String` | The default column key for sorting the table data. If no key is set, nothing is done. **Be sure your data already exists when the component initialises** (i.e. `{this.state.data.length && ...`). |
| `defaultSortOrder` | `String` | `"asc|desc"` If `defaultSortKey` is set, determines the default column sort direction on initialisation. Defaults to `"asc"`. |
| `editableCellProps` | `Object` | An object of Blueprint `<EditableCell />` props to pass through. All handler functions will be passed `value: String, row: Number, { column:Number, columnKey:String }:Object`, which differs slightly from the default implementation options. |

NOTE:

* All other blueprintjs Table props are passed to its root `<Table />` component.

## Usage
```js
import React from 'react';
import { SussolReactTable } from 'sussol-react-table';

const columns = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'code',
    title: 'Code',
    sortable: true,
  },
  {
    key: 'group',
    title: 'Editable Column',
    editable: true,
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({ code: `code${i}`, name: `name${i}`, group: `group${i % 2}` });
}

export class App extends React.Component {
  render() {
    return (
      <div style={{ height: 400 }}>
        <h1>A Beautiful table</h1>
        <SussolReactTable
          columns={columns}
          tableData={data}
          cellDataKey="code"
        />
      </div>
    );
  }
}
```

## Required style dependencies
You will need include the following styles via your `index.html` (or by bundling them). Make sure the path to styles is correct.

* `path/to/node_modules/@blueprintjs/core/dist/blueprint.css`
* `path/to/node_modules/@blueprintjs/table/dist/table.css`
* `path/to/node_modules/normalize.css/normalize.css` (good for resetting to safe, base styles for most all browsers)

## Testing locally via another project

1. From inside `sussol-react-table` run `yarn build`
2. From your project run `yarn add file:path/to/sussol-react-table`
3. Run your project

## Additional docs

Read up on the API for the [blueprintjs table component](http://blueprintjs.com/docs/#components.table-js.api).
