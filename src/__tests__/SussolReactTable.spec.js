/* eslint-disable function-paren-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { SussolReactTable } from '../';

const muiTheme = getMuiTheme();

/**
* MountWithMuiContext
*
* For `mount()` full DOM rendering in enzyme.
* Provides needed context for mui to be rendered properly
* during testing.
*
* @param {obj}    node - ReactElement with mui as root or child
* @return {obj}   ReactWrapper (http://airbnb.io/enzyme/docs/api/ReactWrapper/mount.html)
*/
export const MountWithMuiContext = node => mount(node, {
  context: { muiTheme },
  childContextTypes: { muiTheme: PropTypes.object },
});

test('renders table', () => {
  const table = shallow(
    <SussolReactTable
      columns={[]}
      tableData={[]}
    />,
  );

  expect(table.find('Table').length).toBe(1);
});

test('renders table with props', () => {
  const table = shallow(
    <SussolReactTable
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      tableData={[{ name: 'hello', code: 123 }]}
    />,
  );

  expect(table.props().tableData.length).toBe(1);
  expect(table.props().columns.length).toBe(2);
});

test('renders cells with cellDataKey', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="code"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );

  expect(table.props().tableData.length).toBe(2);
  expect(table.props().columns.length).toBe(2);
  // find 4 total cells with the "code" className's attached
  expect(table.find('.code-123').length).toBe(2);
  expect(table.find('.code-456').length).toBe(2);
});

test('does not render cells with incorrect cellDataKey', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );

  expect(table.props().tableData.length).toBe(2);
  expect(table.props().columns.length).toBe(2);
  // find 4 total cells with the "code" className's attached
  expect(table.find('.code-123').length).toBe(0);
  expect(table.find('.code-456').length).toBe(0);
});

test('table sorts default ascending', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      defaultSortKey="name"
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );
  expect(table.find('Cell').nodes[0].props.children).toBe('hello');
  expect(table.find('Cell').nodes[2].props.children).toBe('hey-hey');
});

test('table sorts descending with defaultSortOrder="desc"', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      defaultSortKey="name"
      defaultSortOrder="desc"
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );
  expect(table.find('Cell').nodes[0].props.children).toBe('hey-hey');
  expect(table.find('Cell').nodes[2].props.children).toBe('hello');
});

test('table sorts ascending with defaultSortOrder="asc"', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      defaultSortKey="code"
      defaultSortOrder="asc"
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );
  expect(table.find('Cell').nodes[1].props.children).toBe(123);
  expect(table.find('Cell').nodes[3].props.children).toBe(456);
});

test('table aligns all cells based defaultColumnAlign', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      defaultColumnAlign="right"
      defaultSortKey="code"
      defaultSortOrder="asc"
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );

  table.find('Cell').nodes.forEach((cell) => {
    expect(cell.props.style.textAlign === 'right').toBe(true);
  });
});

test('table aligns defaults based defaultColumnAlign', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      defaultColumnAlign="right"
      defaultSortKey="code"
      defaultSortOrder="asc"
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );

  table.find('Cell').nodes.forEach((cell) => {
    expect(cell.props.style.textAlign === 'right').toBe(true);
  });
});

test('table aligns defaults to DEFAULT_COLUMN_ALIGN when wrong enum; based defaultColumnAlign', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }, {
        key: 'price',
        title: 'Price',
      }]}
      defaultColumnAlign="WHATEVER"
      defaultSortKey="code"
      defaultSortOrder="asc"
      tableData={[{ name: 'hello', code: 123, price: 1 }, { name: 'hey-hey', code: 456, price: 2 }, { name: 'hey-hey', code: 789, price: 3 }]}
    />,
  );
  expect(table.find('Cell').nodes[0].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').nodes[1].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').nodes[2].props.style.textAlign === 'left').toBe(true);
});

test('table aligns individual cells to DEFAULT_COLUMN_ALIGN when wrong enum; based on column.align; column.align takes precedence', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
        align: 'crap',
      }, {
        key: 'code',
        title: 'Code',
        align: 'ew',
      }, {
        key: 'price',
        title: 'Price',
        align: 'nasty',
      }]}
      defaultColumnAlign="right"
      defaultSortKey="code"
      defaultSortOrder="asc"
      tableData={[{ name: 'hello', code: 123, price: 1 }, { name: 'hey-hey', code: 456, price: 2 }, { name: 'hey-hey', code: 789, price: 3 }]}
    />,
  );
  expect(table.find('Cell').nodes[0].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').nodes[1].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').nodes[2].props.style.textAlign === 'left').toBe(true);
});

// sorry for the direct instance method call;
// their component is hard to simulate events on
// better than no test at all
test('table edit callback given correct data on editCell() called', () => {
  const spy = jest.fn();
  const table = MountWithMuiContext(
    <SussolReactTable
      columns={[{
        key: 'name',
        title: 'Name',
      }, {
        key: 'code',
        title: 'Code',
      }]}
      onEditableCellChange={spy}
      tableData={[{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }]}
    />,
  );

  table.instance().editCell(0, 'name', 'meow');
  // number of times called
  expect(spy.mock.calls.length).toBe(1);
  // args sent back to callback ("spy")
  expect(spy.mock.calls[0][0]).toBe('meow');
  expect(spy.mock.calls[0][1].row).toBe(0);
  expect(spy.mock.calls[0][1].column).toBe('name');
});
