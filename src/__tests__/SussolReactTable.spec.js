import React from 'react';
import { shallow } from 'enzyme';

import { SussolReactTable } from '../';

test('renders Blueprint.js table', () => {
  const table = shallow(
    <SussolReactTable
      columns={[]}
      tableData={[]}
    />
  )

  expect(table.find('Table').length).toBe(1);
});

test('renders Blueprint.js table with props', () => {
  const table = shallow(
    <SussolReactTable
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      tableData={[{ name: 'hi', title: 'Hi!'}]}
    />
  )

  expect(table.props().tableData.length).toBe(1);
  expect(table.props().columns.length).toBe(2);
});
