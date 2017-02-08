# sussol-react-table
A wrapper and simple API for using the blueprintjs data table

# Installation
`npm install --save sussol-react-table`

# Example
```
import React from 'react';
import { SussolReactTable } from 'sussol-react-table';

const columns = [
  {
    key: 'name',
    width: 10,
    title: 'Name',
    sortable: true,
  },
  {
    key: 'code',
    width: 2,
    title: 'Code',
    sortable: true,
  },
  {
    key: 'group',
    width: 2,
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
        />
      </div>
    );
  }
}
```
You will need grab the styles via your index.html file. Make sure the path to styles is correct.
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your Title</title>
    <link rel="stylesheet" href="./src/css/custom.css"></link>
    <link href="relative path to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
    <link href="relative path to/node_modules/@blueprintjs/core/dist/blueprint.css" rel="stylesheet" />
    <link href="relative path to/node_modules/@blueprintjs/table/dist/table.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  </head>
  <body>
    <div id="root" class="container"></div>
    <script src="http://localhost:8080/build/bundle.js" charset="utf-8"></script>
  </body>
</html>

