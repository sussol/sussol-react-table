import React from 'react';
import { Cell, ColumnHeaderCell, EditableCell, Column, Table } from '@blueprintjs/table';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


export class SussolReactTable extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      columns: props.columns || [],
      tableData: [{}, {}],
      searchTerm: '',
      sortBy: props.defaultSortKey || '',
      isAscending: true,
    };
    this.renderCell = this.renderCell.bind(this);
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
  }

  toggleSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

// Renders column headers. Gets the sort direction from state and the label columns array.
  renderColumnHeader() {
    return (
      <ColumnHeaderCell >
        <FlatButton
          label="Dollars"
          labelPosition="before"
          icon={
            // Add if sortable
            if (sortBy = ) {

            }
            <FontIcon className="material-icons">
              {this.state.isAscending ? 'arrow_drop_up' : 'arrow_drop_down'}
            </FontIcon>
          }
          onClick={() => this.toggleSortOrder()}
          style={{ width: '100%' }}
        />
      </ColumnHeaderCell>
    );
  }

  renderCell(rowIndex) {
    return (
      <Cell
        truncated={false}
      >
        row index: {rowIndex}
      </Cell>
    );
  }

  renderEditableCell(rowIndex) {
    return (
      <EditableCell
        truncated={false}
        onConfirm={(newValue) => { console.log(`Changed to ${newValue}`); }}
        value={
          rowIndex % 3 === 0 ? 'A really really really long string!!' : `${this.state.isAscending}`
        }
      />
    );
  }

  renderColumns() {
    const columns = [1,2,3]
    const columnDefinitions = this.state.columns;
    columnDefinitions.forEach((column) => {
      <Column renderCell={() => this.renderCell} renderColumnHeader={() =>this.renderColumnHeader} />
    }
    return columns;
  }

  render() {
    return (
      <div style={{ height: 400 }} >
        <Table numRows={100000}>
            {...this.renderColumns()}
        </Table>
      </div>
    );
  }
}

SussolReactTable.propTypes = {
  columns: React.PropTypes.array,
  tableData: React.PropTyles.array,
  defaultSortKey: React.PropTypes.string,
  hideSearchBar: React.PropTypes.bool,
  rowHeight: React.PropTypes.number,
};

SussolReactTable.defaultProps = {
  rowHeight: 45,
};
