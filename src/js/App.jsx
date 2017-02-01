import React from 'react';
import { Cell, Column, Table } from '@blueprintjs/table';
// import '@blueprintjs/table/dist/table.css';
// import '../css/normalize.css';
// import '../../node_modules/@blueprintjs/core/dist/blueprint.css';


export function App(props) {
  const renderCell = (rowIndex: number) => {
    return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
  };

  return (
    <div>
      <h1>Hello, world!</h1>
      <Table numRows={300}>
          <Column name="Dollars" renderCell={renderCell} />
      </Table>
    </div>
  );
}
