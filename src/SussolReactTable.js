import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Cell, ColumnHeaderCell, EditableCell, Column, Table } from '@blueprintjs/table';
import FlatButton from 'material-ui/FlatButton';

const DEFAULT_SORT = 'asc';

/**
* compare
*
* Provides a basic implementation of either a sort ASC or sort DESC comparator.
* Sort example: 10 will come after 2, not "1, 10, 2"
*
* @param {any}     data which can be converted to a string
* @param {any}     data which can be converted to a string
* @param {bool}    isAscending: true/false
* @return {int}    e.g. -1, 0, 1
*/
const compare = (a, b, isAscending) => (
  isAscending
    ? a.toString().localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    : b.toString().localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
);

const renderSortIcon = direction => (
  direction === 'asc'
    ? <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
);

/**
* sortColumn
*
* Provides sorted data: ASC or DESC given a column key and a comparator func.
*
* @param {str}      columnKey: column key string
* @param {func}     comparator: sort func
* @return {arr}     sorted array
*/
const sortColumn = (columnKey, comparator, tableData, isAscending) => (
  tableData.sort((a, b) => (
    comparator(
      a[columnKey],
      b[columnKey],
      isAscending,
    )
  ))
);

export class SussolReactTable extends PureComponent {
  constructor(props) {
    super(props);

    // initial state
    const { columns, defaultSortOrder, defaultSortKey } = props;

    const sortOrderToBool = defaultSortOrder === DEFAULT_SORT;
    const isAscending = sortOrderToBool;
    const tableData = defaultSortKey
      ? sortColumn(defaultSortKey, compare, props.tableData, isAscending)
      : props.tableData;

    this.state = {
      columns,
      isAscending,
      sortBy: defaultSortKey || '',
      tableData,
    };

    // bindings
    this.editCell = this.editCell.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.renderEditableCell = this.renderEditableCell.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
  }

  componentWillReceiveProps({ tableData }) {
    this.setState({ tableData });
  }

  toggleSortOrder(column) {
    if (!column.sortable) return;

    const { key } = column;
    const { isAscending, tableData } = this.state;
    const sortedTableData = sortColumn(key, compare, tableData, !isAscending);

    this.setState({
      sortBy: key,
      isAscending: !this.state.isAscending,
      tableData: sortedTableData,
    });
  }

  editCell(rowIndex, columnKey, newValue) {
    const { tableData } = this.state;
    tableData[rowIndex][columnKey] = newValue;
    this.setState({
      tableData,
    });
    this.props.onEditableCellChange(newValue, { row: rowIndex, column: columnKey });
  }

  // Renders column headers. Gets the sort direction from state and the label columns array.
  renderColumnHeader(column) {
    let sortIcon;
    const { key, sortable } = column;
    const { isAscending, sortBy } = this.state;

    if (sortable && sortBy === key) {
      sortIcon = isAscending
        ? (renderSortIcon('asc'))
        : (renderSortIcon('desc'));
    }

    return (
      <ColumnHeaderCell>
        <FlatButton
          label={column.title}
          labelPosition="before"
          icon={sortIcon}
          onClick={() => this.toggleSortOrder(column)}
          style={{ width: '100%' }}
        />
      </ColumnHeaderCell>
    );
  }

  renderCell(rowIndex, columnKey, { cellDataKey }) {
    const { tableData } = this.state;
    const value = tableData[rowIndex][columnKey] !== null ? tableData[rowIndex][columnKey] : '';
    const keyClassName = cellDataKey ? `${cellDataKey}-${tableData[rowIndex][cellDataKey]}` : '';

    return (<Cell className={keyClassName}>{value}</Cell>);
  }

  renderEditableCell(rowIndex, columnKey, { cellDataKey }) {
    const { tableData } = this.state;
    const value = tableData[rowIndex][columnKey] !== null ? tableData[rowIndex][columnKey] : '';
    const keyClassName = cellDataKey ? `${cellDataKey}-${tableData[rowIndex][cellDataKey]}` : '';
    return (
      <EditableCell
        className={keyClassName}
        onChange={(newValue) => { this.editCell(rowIndex, columnKey, newValue); }}
        value={value}
      />
    );
  }

  renderColumns(props) {
    const { columns } = this.state;
    let key = 0;

    return columns.map((column) => {
      key += 1;
      return (
        <Column
          key={key}
          renderCell={rowIndex => (
            column.editable
              ? this.renderEditableCell(rowIndex, column.key, props)
              : this.renderCell(rowIndex, column.key, props)
            )
          }
          renderColumnHeader={() => this.renderColumnHeader(column)}
        />
      );
    });
  }

  render() {
    return (
      <Table {...this.props} numRows={this.state.tableData.length}>
        {this.renderColumns(this.props)}
      </Table>
    );
  }
}

SussolReactTable.propTypes = {
  ...Table.propTypes,
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  defaultSortKey: PropTypes.string,
  onEditableCellChange: PropTypes.func,
  rowHeight: PropTypes.number,
};

SussolReactTable.defaultProps = {
  columns: [],
  defaultSortKey: '',
  defaultSortOrder: DEFAULT_SORT,
  onEditableCellChange: () => {},
  rowHeight: 45,
};
