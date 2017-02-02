import React from 'react';
import { ColumnHeaderCell, EditableCell, Column, Table, TruncatedFormat } from '@blueprintjs/table';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

class SussolReactTable extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isAscending: true,
    };
    this.renderCell = this.renderCell.bind(this);
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.renderSortButton = this.renderSortButton.bind(this);
  }

  toggleSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  renderSortButton() {
    return <p onClick={this.toggleSortOrder}>Toggle sort order</p>;
  }

  renderColumnHeader() {
    return (
      <ColumnHeaderCell >
        <FlatButton
          label="Dollars"
          labelPosition="before"
          icon={<FontIcon className="material-icons" >{this.state.isAscending ? 'arrow_drop_up' : 'arrow_drop_down'}</FontIcon>}
          onClick={this.toggleSortOrder}
          style={{ width: '100%' }}
        />
      </ColumnHeaderCell>
    );
  }

  renderCell(rowIndex) {
    return (
      <EditableCell
        truncated={false}
        onConfirm={(newValue)=>{ console.log(`Changed to ${newValue}`) }}
        value={
          rowIndex % 3 === 0 ? 'A really really really really really really really really really long string!!' : `${this.state.isAscending}`
        }
      >
      </EditableCell>
    );
  }

  render() {
    return (
      <div style={{height:400}} >
        <Table numRows={100000}>
            <Column renderCell={this.renderCell} renderColumnHeader={this.renderColumnHeader} />
        </Table>
      </div>
    );
  }
}



export class App extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isAscending: true,
    };
    this.renderCell = this.renderCell.bind(this);
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.renderSortButton = this.renderSortButton.bind(this);
  }

  toggleSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  renderSortButton() {
    return <p onClick={this.toggleSortOrder}>Toggle sort order</p>;
  }

  renderColumnHeader() {
    return (
      <ColumnHeaderCell >
        <FlatButton
          label="Dollars"
          labelPosition="before"
          icon={<FontIcon className="material-icons" >{this.state.isAscending ? 'arrow_drop_up' : 'arrow_drop_down'}</FontIcon>}
          onClick={this.toggleSortOrder}
          style={{ width: '100%' }}
        />
      </ColumnHeaderCell>
    );
  }

  renderCell(rowIndex) {
    return <EditableCell truncated={false} onConfirm={(newValue) => {console.log(`Changed to ${newValue}`);}} value={rowIndex % 3 === 0 ? 'A really really really really really really really really really long string!!' : `${this.state.isAscending}`}></EditableCell>;
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <SussolReactTable />
      </div>
    );
  }
}
