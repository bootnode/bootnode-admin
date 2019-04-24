import React from 'react'
import MUITable from './mui-table'
import capitalize from '../../src/string/capitalize'

export class ColumnData {
  constructor(name = 'Name', key, searchKey, options, renderFn) {
    this.key = key || name.toLowerCase()
    this.searchKey = searchKey || this.key
    this.name = name
    this.options = Object.assign({ filter: true, sort: true, download: true, display: 'true' }, options || {})
    this.renderFn = renderFn
  }
}

// This specifically interfaces with Hanzo api tables
export default class MUIServerTable extends MUITable {
  constructor(props) {
    super(props)

    this.serverSide = true
  }

  onTableChange = (command, params) => {
    console.log('table change', command, params)

    switch(command) {
      case 'sort':
      case 'search':
      case 'changePage':
        break
      default:
        return
    }

    if (this.props.onTableChange) {

      let columns = this.props.columns
      let sort

      for (let k in columns) {
        let column = columns[k]
        let columnParam = params.columns[k]

        if (columnParam.sortDirection) {
          if (columnParam.sortDirection == 'asc') {
            sort = '-' + capitalize(column.searchKey)
          } else {
            sort = capitalize(column.searchKey)
          }
          break
        }
      }

      let q = params.searchText
      let page = params.page + 1
      let display = params.rowsPerPage

      this.props.onTableChange({
        q,
        page,
        display,
        sort,
      }, command, params)
    }
  }
}

