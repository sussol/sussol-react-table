import React from 'react';
import { SussolReactTable } from './SussolReactTable.jsx';

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
    title: 'Edit Test',
    isEditable: true,
  },
];

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({ code: `code${i}`, name: `name${i}`, group: `group${i % 2}` });
}

export class App extends React.Component {
  render() {
    return (
      <div height={500}>
        <h1>A Beautiful table</h1>
        <SussolReactTable
          columns={columns}
          tableData={data}
        />
      </div>
    );
  }
}
