import React from 'react';
import { Cell, ColumnHeaderCell, EditableCell, Column, Table } from '@blueprintjs/table';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


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

    if ( column.sortable &&this.state.sortBy === column.key ) {
      sortIcon = (
        <FontIcon className="material-icons">
          {this.state.isAscending ? 'arrow_drop_up' : 'arrow_drop_down'}
        </FontIcon>
      );
    }
    return (
      <ColumnHeaderCell >
        <FlatButton
          label={column.title}
          labelPosition="before"
          icon={sortIcon}
          onClick={() => this.toggleSortOrder(column.key)}
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

  render() {
    return (
      <Table numRows={this.state.tableData.length}>
        {this.renderColumns()}
      </Table>
    );
  }
}

SussolReactTable.propTypes = {
  columns: React.PropTypes.array,
  tableData: React.PropTypes.array,
  defaultSortKey: React.PropTypes.string,
  hideSearchBar: React.PropTypes.bool,
  rowHeight: React.PropTypes.number,
};

SussolReactTable.defaultProps = {
  rowHeight: 45,
};
