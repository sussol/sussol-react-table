import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Cell, ColumnHeaderCell, EditableCell, Column, Table } from '@blueprintjs/table';
import FlatButton from 'material-ui/FlatButton';

const DEFAULT_SORT = 'asc';
const DEFAULT_COLUMN_ALIGN = 'left';

const styles = {
  cell: {
    textAlign: DEFAULT_COLUMN_ALIGN,
  },
  getCellStyles: function cellStyles(align, corePropStyle) { // eslint-disable-line object-shorthand
    const map = {
      left: 'left',
      center: 'center',
      right: 'right',
    };

    // return enum mapped value, else default if invalid enum
    return {
      ...corePropStyle,
      textAlign: map[align] ? map[align] : DEFAULT_COLUMN_ALIGN,
    };
  },
};

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
    this.adjustCellHeight = this.adjustCellHeight.bind(this);
    this.getCellText = this.getCellText.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderEditableCell = this.renderEditableCell.bind(this);
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.tableRef = this.tableRef.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
  }

  componentDidMount() {
    if (this.state.tableData.length === 0) this.generateLoadingRows();

    this.adjustCellHeight();
  }

  componentWillReceiveProps({ defaultSortKey, defaultSortOrder, tableData }) {
    const data = defaultSortKey
      ? sortColumn(defaultSortKey, compare, tableData, defaultSortOrder === DEFAULT_SORT)
      : tableData;

    this.setState(
      { tableData: data, dataLoading: !(tableData.length > 0) },
      // use `Table` instance method to get dynamic height based on character count
      () => { this.adjustCellHeight(); },
    );
  }

  componentDidUpdate() {
    this.adjustCellHeight();
  }

  /**
   * getCellText
   *
   * Fulfils contract for `resizeRowsByApproximateHeight`. Basically, just
   * needs to access the cell's text content.
   *
   * @param  {int} row       cell row index
   * @param  {int} column    cell column index
   * @return {str}           cell text content
   */
  getCellText(row, column) {
    const rowKeys = Object.keys(this.state.tableData[row]);
    const columnSelected = rowKeys[column];
    return this.state.tableData[row][columnSelected];
  }

  /**
   * adjustCellHeight - calls <Table /> instance method
   * @see http://blueprintjs.com/docs/v1/#table-js.instance-methods
   */
  adjustCellHeight() {
    const { cellAutoHeight } = this.props;
    if (!cellAutoHeight) return;
    this.table.resizeRowsByApproximateHeight(
      this.getCellText,
      // options from user; fulfils contract
      typeof cellAutoHeight === 'boolean' ? {} : cellAutoHeight,
    );
  }

  generateLoadingRows(rowCount = this.props.loadingRowCount) {
    if (rowCount === 0) return;
    const rows = [];
    const { columns } = this.state;
    for (let i = 0; i < rowCount; i += 1) {
      rows.push({});

      for (let j = 0; j < columns.length; j += 1) {
        rows[i][columns[j].key] = columns[j].key;
      }
    }

    this.setState({ tableData: rows, dataLoading: true });
  }

  tableRef(table = Table) { this.table = table; }

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

  renderCell(rowIndex, columnIndex, { align, key }, { cellDataKey, coreCellProps }) {
    const { dataLoading, tableData } = this.state;
    const value = tableData[rowIndex][key] !== null ? tableData[rowIndex][key] : '';
    const keyClassName = cellDataKey ? `${cellDataKey}-${tableData[rowIndex][cellDataKey]}` : '';
    const cellAlign = align || this.props.defaultColumnAlign;
    return (
      <Cell
        {...coreCellProps}
        loading={dataLoading}
        // @note bp doesn't pass through data props,
        // so we can't use custom attributes here for `cellDataKey`
        className={(coreCellProps.className ? `${coreCellProps.className} ${keyClassName}` : keyClassName)}
        style={styles.getCellStyles(cellAlign, (coreCellProps && coreCellProps.style))}
      >
        {value}
      </Cell>
    );
  }

  renderEditableCell(rowIndex, columnIndex, columnKey, { cellDataKey }) {
    const { tableData } = this.state;
    const value = tableData[rowIndex][columnKey] !== null ? tableData[rowIndex][columnKey] : '';
    const keyClassName = cellDataKey ? `${cellDataKey}-${tableData[rowIndex][cellDataKey]}` : '';
    // @todo remove legacy `editableCellProps` in major rev.
    const { coreEditableCellProps, editableCellProps } = this.props;
    return (
      <EditableCell
        {...editableCellProps}
        {...coreEditableCellProps}
        // sorry to possibly thwart your propTypes,
        // but we need more than just the columnIndex, Blueprint!
        columnIndex={{ column: columnIndex, columnKey }}
        rowIndex={rowIndex}
        value={value}
        className={keyClassName}
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
          renderCell={(rowIndex, columnIndex) => (
            column.editable
              ? this.renderEditableCell(rowIndex, columnIndex, column.key, props)
              : this.renderCell(rowIndex, columnIndex, column, props)
          )}
          renderColumnHeader={() => this.renderColumnHeader(column)}
        />
      );
    });
  }

  render() {
    return (
      <Table ref={this.tableRef} {...this.props} numRows={(this.state.tableData.length)}>
        {this.renderColumns(this.props)}
      </Table>
    );
  }
}

SussolReactTable.propTypes = {
  cellAutoHeight: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.bool,
  ]),
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  coreCellProps: PropTypes.objectOf(PropTypes.any),
  coreEditableCellProps: PropTypes.objectOf(PropTypes.any),
  defaultColumnAlign: PropTypes.string,
  defaultSortKey: PropTypes.string,
  defaultSortOrder: PropTypes.string,
  editableCellProps: PropTypes.objectOf(PropTypes.any),
  loadingRowCount: PropTypes.number,
  onEditableCellChange: PropTypes.func,
  tableData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

SussolReactTable.defaultProps = {
  cellAutoHeight: false,
  columns: [],
  coreCellProps: {},
  coreEditableCellProps: {},
  editableCellProps: {},
  defaultColumnAlign: DEFAULT_COLUMN_ALIGN,
  defaultSortKey: '',
  defaultSortOrder: DEFAULT_SORT,
  loadingRowCount: 0,
  onEditableCellChange: () => {},
};
