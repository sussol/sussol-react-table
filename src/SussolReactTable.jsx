import React from 'react';
import PropTypes from 'prop-types';
import { Cell, ColumnHeaderCell, EditableCell, Column, Table } from '@blueprintjs/table';
import FlatButton from 'material-ui/FlatButton';

/**
* compare
*
* Provides a basic implementation of either a sort ASC or sort DESC comparator.
*
* @param {any}     data which can be converted to a string
* @param {any}     data which can be converted to a string
* @param {bool}    isAscending: true/false
* @return {int}    e.g. -1, 0, 1
*/
const compare = (a, b, isAscending) => {
  return isAscending
    ? a.toString().localeCompare(b)
    : b.toString().localeCompare(a);
}

const noop = () => {};

export class SussolReactTable extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      columns: props.columns || [],
      tableData: props.tableData,
      searchTerm: '',
      sortBy: props.defaultSortKey || '',
      isAscending: true,
    };
    this.editCell = this.editCell.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.renderEditableCell = this.renderEditableCell.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tableData: nextProps.tableData });
  }

  toggleSortOrder(columnKey) {
    this.setState({
      sortBy: columnKey,
      isAscending: !this.state.isAscending,
      tableData: this.sortColumn(columnKey, compare),
    });
  }

  /**
  * sortColumn
  *
  * Provides sorted data: ASC or DESC given a column key and a comparator func.
  *
  * @param {str}      columnKey: column key string
  * @param {func}     comparator: sort func
  * @return {arr}     sorted array
  */
  sortColumn(columnKey, comparator) {
    const { tableData } = this.state;
    return tableData.sort((a, b) => {
      return comparator(
        a[columnKey],
        b[columnKey],
        this.state.isAscending,
      );
    });
  }

  editCell(rowIndex, columnKey, newValue) {
    const tableData = this.state.tableData;
    tableData[rowIndex][columnKey] = newValue;
    this.setState({
      tableData: tableData,
    });
  }

  // Renders column headers. Gets the sort direction from state and the label columns array.
  renderColumnHeader(column) {
    let sortIcon;

    if (column.sortable && this.state.sortBy === column.key) {
      sortIcon = this.state.isAscending
        ? (this.renderSortIcon('asc'))
        : (this.renderSortIcon('desc'));
    }

    return (
      <ColumnHeaderCell>
        <FlatButton
          label={column.title}
          labelPosition="before"
          icon={sortIcon}
          onClick={
            column.sortable
            ? () => this.toggleSortOrder(column.key)
            : noop
          }
          style={{ width: '100%' }}
        />
      </ColumnHeaderCell>
    );
  }

  renderCell(rowIndex, columnKey) {
    const tableData = this.state.tableData;
    const value = tableData[rowIndex][columnKey] != null ? tableData[rowIndex][columnKey] : '';
    return (
      <Cell>{value}</Cell>
    );
  }

  renderEditableCell(rowIndex, columnKey) {
    const tableData = this.state.tableData;
    const value = tableData[rowIndex][columnKey] != null ? tableData[rowIndex][columnKey] : '';
    return (
      <EditableCell
        onConfirm={(newValue) => { this.editCell(rowIndex, columnKey, newValue); }}
        value={value}
      />
    );
  }

  renderColumns() {
    const columnDefinitions = this.state.columns;
    const columns = columnDefinitions.map((columnDef, index) => {
      if (columnDef.editable) {
        return (
          <Column
            key={index}
            renderCell={(rowIndex) => this.renderEditableCell(rowIndex, columnDef.key)}
            renderColumnHeader={() => this.renderColumnHeader(columnDef)}
          />
        );
      }
      return (
        <Column
          key={index}
          renderCell={(rowIndex) => this.renderCell(rowIndex, columnDef.key)}
          renderColumnHeader={() => this.renderColumnHeader(columnDef)}
        />
      );
    });
    return columns;
  }

  renderSortIcon(direction) {
    return direction === 'asc'
      ? <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
      : <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>;
  }

  render() {
    return (
      <Table {...this.props} numRows={this.state.tableData.length}>
        {this.renderColumns()}
      </Table>
    );
  }
}

SussolReactTable.propTypes = {
  ...Table.propTypes,
  columns: PropTypes.array,
  tableData: PropTypes.array,
  defaultSortKey: PropTypes.string,
  hideSearchBar: PropTypes.bool,
  rowHeight: PropTypes.number,
};

SussolReactTable.defaultProps = {
  rowHeight: 45,
};
