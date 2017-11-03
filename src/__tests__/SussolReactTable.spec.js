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
    />
  )

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
      tableData={[{ name: 'hello', code: 123}]}
    />
  )

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
    />
  )

  expect(table.props().tableData.length).toBe(2);
  expect(table.props().columns.length).toBe(2);
  // find 4 total cells with the "code" className's attached
  expect(table.find('.123').length).toBe(2);
  expect(table.find('.456').length).toBe(2);
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
    />
  )

  expect(table.props().tableData.length).toBe(2);
  expect(table.props().columns.length).toBe(2);
  // find 4 total cells with the "code" className's attached
  expect(table.find('.123').length).toBe(0);
  expect(table.find('.456').length).toBe(0);
});
