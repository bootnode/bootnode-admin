import React from 'react'
import Router from 'next/router'
import LoggedInPage from '../../components/pages/logged-in'
import MUIServerTable, { ColumnData } from '../../components/tables/mui-server-table'

import Api from '../../src/hanzo/api'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
import { renderUIDate } from '../../src/util/date.js'

import Emitter from '../../src/emitter'
import capitalize from '../../src/string/capitalize'
import { watch } from '../../src/referential/provider'
import { startLoading, stopLoading } from '../../components/app/loader'

let columns = [
  new ColumnData('Created On', 'createdAt', null, null, renderUIDate),
  new ColumnData('Email', 'email'),
  new ColumnData('First Name', 'firstName'),
  new ColumnData('Last Name', 'lastName'),
  new ColumnData('Flagged', 'kyc.flagged', 'KYCFlagged', null, v => capitalize('' + !!v)),
  new ColumnData('Frozen', 'kyc.frozen', 'KYCFrozen', null, v => capitalize('' + !!v)),
  new ColumnData('Status', 'kyc.status', 'KYCStatus', null, v => capitalize(v)),
]

@watch('usersPage')
class Index extends LoggedInPage {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.state = {
      rows: [],
      count: 0,
    }

    let opts = this.props.data.get('search')
    if (!opts) {
      opts = {
        page: 1,
        display: 10,
      }

      this.props.data.set('search', opts)
    }
  }

  componentDidMount() {
    startLoading('Loading Users')

    this.loadTable().then(() => {
      stopLoading()
    }).catch(()=>{
      stopLoading()
    })
  }

  loadTable() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    let opts = this.props.data.get('search')

    return api.client.user.list(opts).then((res) => {
      let page = parseInt(res.page, 10)
      let display = parseInt(res.display, 10)

      this.setState({
        rows: res.models,
        count: res.count,
      })
    })
  }

  onTableChange = (opts) => {
    this.props.data.set('search', opts)

    this.loadTable()
  }

  onRowClick = (i) => {
    if (this.state.rows[i]) {
      let id = this.state.rows[i].id
      Router.push(`/dash/user?id=${id}`)
    }
  }

  render() {
    let {
      rows,
      count,
    } = this.state

    let opts = {
      count: count,
      page: this.props.data.get('search.page') || 1,
      rowsPerPage: this.props.data.get('search.display') || 10,
      serverSide: true,
    }

    return pug`
      main#dash.dash
        .content.columns
          MUIServerTable(
            title='Users'
            searchText=this.props.data.get('search.q')
            columns=columns
            rows=rows
            options=opts
            onTableChange=this.onTableChange
            onRowClick=this.onRowClick
          )
    `
  }
}

export default Index
