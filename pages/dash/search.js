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
import * as qs from 'query-string'

let userColumns = [
  new ColumnData('Created On', 'createdAt', null, null, renderUIDate),
  new ColumnData('Email', 'email'),
  new ColumnData('First Name', 'firstName'),
  new ColumnData('Last Name', 'lastName'),
  new ColumnData('Flagged', 'kyc.flagged', 'KYCFlagged', null, v => capitalize('' + !!v)),
  new ColumnData('Frozen', 'kyc.frozen', 'KYCFrozen', null, v => capitalize('' + !!v)),
  new ColumnData('Status', 'kyc.status', 'KYCStatus', null, v => capitalize(v)),
]

let transactionColumns = [
  new ColumnData('Created On', 'createdAt', null, null, renderUIDate),
  new ColumnData('Hash', 'transactionHash', null, null, v => pug`.table-ellipsis=v`),
  new ColumnData('Protocol', 'protocol'),
  new ColumnData('From', 'sendingName', null, null, (v, r) => {
    return pug`
      .from-name
        =v
      .from-jurisdiction
        =r.sendingState + ', ' + r.sendingCountry
      .from-address.table-ellipsis
        =r.sendingAddress
    `
  }),
  new ColumnData('To', 'receivingName', null, null, (v, r) => {
    return pug`
      .to-name
        =v
      .to-jurisdiction
        =r.receivingState + ', ' + r.receivingCountry
      .to-address.table-ellipsis
        =r.receivingAddress
    `
  }),
  new ColumnData('Amount', 'amount'),
]

@watch('usersPage')
class Index extends LoggedInPage {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.state = {
      userRows: [],
      userCount: 0,
      transactionRows: [],
      transactionCount: 0,
    }

    let opts = this.props.data.get('search.users')
    if (!opts) {
      opts = {
        page: 1,
        display: 10,
      }

      this.props.data.set('search.users', opts)
      this.props.data.set('search.transactions', opts)
    }

    this.loadTables = (k ,v) => {
      if (k == 'header.search') {
        this.loadUserTable(v)
        this.loadTransactionTable(v)
      }
    }

    this.props.rootData.on('set', this.loadTables)
  }

  componentDidMount() {
    startLoading('Searching')

    let ps = [this.loadUserTable(), this.loadTransactionTable()]
    Promise.all(ps).then(() => {
      stopLoading()
    }).catch(()=>{
      stopLoading()
    })
  }

  componentWillUnmount() {
    this.props.rootData.off('set', this.loadTables)
  }

  loadUserTable(q) {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    let opts = this.props.data.get('search.users')
    if (opts) {
      if (q != null) {
        opts.q = q
      } else {
        let query = qs.parse(window.location.search)
        opts.q = query.q
      }
    }

    return api.client.user.list(opts).then((res) => {
      let page = parseInt(res.page, 10)
      let display = parseInt(res.display, 10)

      this.setState({
        userRows: res.models,
        userCount: res.count,
      })
    })
  }

  loadTransactionTable(q) {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    let opts = this.props.data.get('search.transactions')
    if (opts) {
      if (q != null) {
        opts.q = q
      } else {
        let query = qs.parse(window.location.search)
        opts.q = query.q
      }
    }

    return api.client.tokentransaction.list(opts).then((res) => {
      let page = parseInt(res.page, 10)
      let display = parseInt(res.display, 10)

      this.setState({
        transactionRows: res.models,
        transactionCount: res.count,
      })
    })
  }

  onUserTableChange = (opts) => {
    this.props.data.set('search.users', opts)

    this.loadUserTable()
  }

  onTransactionTableChange = (opts) => {
    this.props.data.set('search.transactions', opts)

    this.loadTransactionTable()
  }

  onRowClick = (i) => {
    if (this.state.rows[i]) {
      let id = this.state.rows[i].id
      Router.push(`/dash/user?id=${id}`)
    }
  }

  onCellClick = (i, j) => {
    console.log('click', i, j)
    switch(j) {
      case 3:
        if (this.state.rows[i]) {
          let id = this.state.rows[i].sendingUserId
          Router.push(`/dash/user?id=${id}`)
        }
        return
      case 4:
        if (this.state.rows[i]) {
          let id = this.state.rows[i].receivingUserId
          Router.push(`/dash/user?id=${id}`)
        }
        return
    }
  }

  render() {
    let {
      userRows,
      userCount,
      transactionRows,
      transactionCount,
    } = this.state

    let userOpts = {
      count: userCount,
      page: this.props.data.get('search.users.page') || 1,
      rowsPerPage: this.props.data.get('search.users.display') || 10,
      serverSide: true,
      print: false,
      search: false,
      filter: false,
      download: false,
      viewColumns: false,
    }

    let transactionOpts = {
      count: transactionCount,
      page: this.props.data.get('search.transactions.page') || 1,
      rowsPerPage: this.props.data.get('search.transactions.display') || 10,
      serverSide: true,
      print: false,
      search: false,
      filter: false,
      download: false,
      viewColumns: false,
    }

    return pug`
      main#dash.dash
        .content.rows
          MUIServerTable(
            title='Users'
            searchText=this.props.data.get('search.q')
            columns=userColumns
            rows=userRows
            options=userOpts
            onTableChange=this.onUserTableChange
            onRowClick=this.onRowClick
          )
          MUIServerTable(
            title='Transactions'
            searchText=this.props.data.get('search.q')
            columns=transactionColumns
            rows=transactionRows
            options=transactionOpts
            onTableChange=this.onTransactionTableChange
            onCellClick=this.onCellClick
            onRowClick=this.onRowClick
          )
    `
  }
}

export default Index
