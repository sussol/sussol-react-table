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

