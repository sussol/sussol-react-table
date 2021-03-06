/* eslint-disable function-paren-newline */
import React from 'react';
import PropTypes from 'prop-types';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { SussolReactTable } from '../';

Enzyme.configure({ adapter: new Adapter() });

const muiTheme = getMuiTheme();

const createStringOfLength = length => new Array(length).fill('a').join('');

const classNameContains = (className, classes) => (
  classes.split(' ').includes(className)
);

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

  expect(table.length).toBe(1);
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

  expect(table.get(0).props.tableData.length).toBe(1);
  expect(table.get(0).props.columns.length).toBe(2);
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
  expect(classNameContains('code-123', table.find('Cell').getElements()[0].props.className)).toBe(true);
  expect(classNameContains('code-123', table.find('Cell').getElements()[1].props.className)).toBe(true);
  expect(classNameContains('code-456', table.find('Cell').getElements()[2].props.className)).toBe(true);
  expect(classNameContains('code-456', table.find('Cell').getElements()[3].props.className)).toBe(true);
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

  expect(classNameContains('blahblah', table.find('Cell').getElements()[0].props.className)).toBe(false);
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
  expect(table.find('Cell').getElements()[0].props.children).toBe('hello');
  expect(table.find('Cell').getElements()[2].props.children).toBe('hey-hey');
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
  expect(table.find('Cell').getElements()[0].props.children).toBe('hey-hey');
  expect(table.find('Cell').getElements()[2].props.children).toBe('hello');
});

test('table maintains sort between receive of props', () => {
  const tableData = [{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }];
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
        sortable: true,
      }, {
        key: 'code',
        title: 'Code',
        sortable: true,
      }]}
      defaultSortKey="name"
      defaultSortOrder="desc"
      tableData={[]}
      selectedRegions={[{ rows: 1 }]}
    />,
  );

  // update data
  table.setProps({ tableData });

  expect(table.find('Cell').at(1).props().children).toBe(456);
  expect(table.find('Cell').at(3).props().children).toBe(123);

  table.find('ColumnHeaderCell').find('FlatButton').at(0).simulate('click');

  expect(table.find('Cell').at(1).props().children).toBe(123);
  expect(table.find('Cell').at(3).props().children).toBe(456);

  table.setProps({ selectedRegions: [{ rows: 0 }] });

  expect(table.find('Cell').at(1).props().children).toBe(123);
  expect(table.find('Cell').at(3).props().children).toBe(456);
});

test('table sorts when column header is clicked', () => {
  const tableData = [{ name: 'hello', code: 123 }, { name: 'hey-hey', code: 456 }];
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
        sortable: true,
      }, {
        key: 'code',
        title: 'Code',
      }]}
      defaultSortKey="name"
      defaultSortOrder="desc"
      tableData={[]}
    />,
  );

  // update data
  table.setProps({ tableData });

  expect(table.find('Cell').at(1).props().children).toBe(456);
  expect(table.find('Cell').at(3).props().children).toBe(123);

  table.find('ColumnHeaderCell').find('FlatButton').at(0).simulate('click');

  expect(table.find('Cell').at(3).props().children).toBe(456);
  expect(table.find('Cell').at(1).props().children).toBe(123);
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
  expect(table.find('Cell').getElements()[1].props.children).toBe(123);
  expect(table.find('Cell').getElements()[3].props.children).toBe(456);
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

  table.find('Cell').getElements().forEach((cell) => {
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

  table.find('Cell').getElements().forEach((cell) => {
    expect(cell.props.style.textAlign === 'right').toBe(true);
  });

  table.find('ColumnHeaderCell').find('FlatButton').getElements().forEach((cell) => {
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
  expect(table.find('Cell').getElements()[0].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').getElements()[1].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').getElements()[2].props.style.textAlign === 'left').toBe(true);
});

test('table aligns individual cells; based on column.align; column.align takes precedence', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellDataKey="blahblah"
      columns={[{
        key: 'name',
        title: 'Name',
        align: 'left',
      }, {
        key: 'code',
        title: 'Code',
        align: 'right',
      }, {
        key: 'price',
        title: 'Price',
        align: 'center',
      }]}
      defaultColumnAlign="right"
      defaultSortKey="code"
      defaultSortOrder="asc"
      tableData={[{ name: 'hello', code: 123, price: 1 }, { name: 'hey-hey', code: 456, price: 2 }, { name: 'hey-hey', code: 789, price: 3 }]}
    />,
  );
  expect(table.find('Cell').getElements()[0].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').getElements()[1].props.style.textAlign === 'right').toBe(true);
  expect(table.find('Cell').getElements()[2].props.style.textAlign === 'center').toBe(true);

  expect(table.find('ColumnHeaderCell').find('FlatButton').getElements()[0].props.style.textAlign === 'left').toBe(true);
  expect(table.find('ColumnHeaderCell').find('FlatButton').getElements()[1].props.style.textAlign === 'right').toBe(true);
  expect(table.find('ColumnHeaderCell').find('FlatButton').getElements()[2].props.style.textAlign === 'center').toBe(true);
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
  expect(table.find('Cell').getElements()[0].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').getElements()[1].props.style.textAlign === 'left').toBe(true);
  expect(table.find('Cell').getElements()[2].props.style.textAlign === 'left').toBe(true);
});

test('cellAutoHeight causes cells to change height', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellAutoHeight
      coreCellProps={{ wrapText: true }}
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
      columnWidths={[130, 227, 130]}
      tableData={[
        { name: createStringOfLength(100), code: 123, price: 1 },
        { name: createStringOfLength(100), code: 456, price: 2 },
        { name: createStringOfLength(120), code: 789, price: 3 },
      ]}
    />,
  );

  table.update();

  expect(table.find('Cell').getElements()[0].props.style.height).toBe('162px');
});

test('cellAutoHeight=false causes cells to remain same default height', () => {
  const table = MountWithMuiContext(
    <SussolReactTable
      cellAutoHeight={false}
      coreCellProps={{ wrapText: true }}
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
      columnWidths={[130, 227, 130]}
      tableData={[
        { name: createStringOfLength(100), code: 123, price: 1 },
        { name: createStringOfLength(100), code: 456, price: 2 },
        { name: createStringOfLength(120), code: 789, price: 3 },
      ]}
    />,
  );

  table.update();

  expect(table.find('Cell').getElements()[0].props.style.height).toBe('20px');
});

test('Cell loading happens when no initial data', () => {
  const expectedData = [
    { name: 'name', code: 'code', price: 'price' },
    { name: 'name', code: 'code', price: 'price' },
    { name: 'name', code: 'code', price: 'price' },
  ];

  const table = shallow(
    <SussolReactTable
      cellAutoHeight
      coreCellProps={{ wrapText: true }}
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
      columnWidths={[130, 227, 130]}
      tableData={[]}
      loadingRowCount={3}
    />,
  );

  expect(table.state().dataLoading).toBe(true);
  expect(table.state().tableData).toEqual(expectedData);
});

test('Cell loading disappears after data loaded', () => {
  const expectedData = [
    { name: 'name', code: 'code', price: 'price' },
    { name: 'name', code: 'code', price: 'price' },
    { name: 'name', code: 'code', price: 'price' },
  ];
  const networkData = [
    { name: 'hey', code: 'ERT', price: '123' },
    { name: 'hello', code: 'CVB', price: '456' },
    { name: 'hi', code: 'DAS', price: '789' },
  ];

  // need to mount to retain ref access
  const table = MountWithMuiContext(
    <SussolReactTable
      cellAutoHeight
      coreCellProps={{ wrapText: true }}
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
      columnWidths={[130, 227, 130]}
      tableData={[]}
      loadingRowCount={3}
    />,
  );

  expect(table.state().dataLoading).toBe(true);
  expect(table.state().tableData).toEqual(expectedData);

  table.setProps({ tableData: networkData });

  expect(table.state().dataLoading).toBe(false);
  expect(table.state().tableData).toEqual(networkData);
});
