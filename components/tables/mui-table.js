import React from 'react'
import MUIDataTable from './mui-data-table'
import * as flat from 'flat'

export class ColumnData {
  constructor(name = 'Name', key, options, renderFn) {
    this.key = key || name.toLowerCase()
    this.name = name
    this.options = Object.assign({ filter: true, sort: true, download: true, display: 'true' }, options || {})
    this.renderFn = renderFn
  }
}

export default class MUITable extends React.Component {
  static defaultProps = {
    title: 'Title',
    rows: [],
    columns: [],
    options: {
      page: 1,
      serverSide: true,
      onTableChange: undefined,
      rowsPerPage: 10,
      rowsPerPageOptions: [ 10, 50, 100 ]
    },
  }

  onRowClick = (row, indices) => {
    console.log('row click', row, indices)

    if (this.props.onRowClick) {
      this.props.onRowClick(indices.rowIndex)
    }
  }

  onCellClick = (cell, indices) => {
    console.log('cell click', cell, indices)

    if (this.props.onCellClick) {
      this.props.onCellClick(indices.rowIndex, indices.colIndex)
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    let {
      columns,
      display,
      rows,
      options,
      serverSide,
      onTableChange,
      onRowClick,
      onCellClick,
      ...props
    } = this.props

    rows = rows.map((rowNotFlat) => {
      let row = flat(rowNotFlat)
      return columns.map((column) => {
        if (column.renderFn) {
          return column.renderFn(row[column.key], row) || ''
        }

        return row[column.key] || ''
      })
    })

    options = Object.assign({}, options, {
      page: options.page - 1,
      rowsPerPage: display || options.rowsPerPage,
      serverSide: this.serverSide || serverSide,
      onTableChange: this.onTableChange,
      onRowClick: this.onRowClick,
      onCellClick: this.onCellClick,
    })

    return pug`
      MUIDataTable(
        ...props
        columns=columns
        data=rows
        options=options
      )
    `
  }
}

