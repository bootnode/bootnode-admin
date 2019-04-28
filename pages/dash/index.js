import React from 'react'
import Router from 'next/router'
import LoggedInPage from '../../components/pages/logged-in'
import NodeCard from '../../components/node-card'
import Divider from '@material-ui/core/Divider'
import Fab from '@material-ui/core/Fab'
import Add from '@material-ui/icons/Add'

import BootNode from '../../src/bootnode/client'
// import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
import { renderUIDate } from '../../src/util/date.js'

import Emitter from '../../src/emitter'
import capitalize from '../../src/string/capitalize'
import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import { startLoading, stopLoading } from '../../components/app/loader'

@watch('nodesPage')
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

  async componentDidMount() {
    startLoading(' ')

    try {
      await this.loadTable()
    } catch (e) {

    }

    stopLoading()

    let fn = async () => {
      await this.loadTable()

      this.timeoutId = setTimeout(fn, 10000)
    }

    this.timeoutId = setTimeout(fn, 10000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  async loadTable() {
    let api = new BootNode()

    // let opts = this.props.data.get('search')
    //

    let res = await api.request('GET', 'nodes')

    this.setState({
      rows: res.data,
      count: res.data.length,
    })
  }

  onTableChange = (opts) => {
    this.props.data.set('search', opts)

    this.loadTable()
  }

  onRowClick = (i) => {
    if (this.state.rows[i]) {
      let id = this.state.rows[i].id
      // Router.push(`/dash/user?id=${id}`)
    }
  }

  newNode = async () => {
    startLoading(' ')
    try {
      let api = new BootNode()
      await api.request('PUT', 'nodes')

      await this.loadTable()
    } catch (e) {

    }
    stopLoading(' ')
  }

  deleteNode = (id) => {
    return async () => {
      startLoading(' ')
      try {
        let api = new BootNode()
        await api.request('DELETE', 'nodes/' + id)

        await this.loadTable()
      } catch (e) {
      }
      stopLoading(' ')
    }
  }

  render() {
    let { classes } = this.props

    let {
      rows,
      count,
    } = this.state

    let nodeCardsJSX = []

    for (let k in rows) {
      let data = rows[k]

      nodeCardsJSX.push(pug`
        NodeCard.node-card(
          key=data.id
          data=data
          onDelete=this.deleteNode
        )
      `)
    }

    return pug`
      main#nodes.dash
        .content
          .buttons
            Fab(
              variant='extended'
              color='primary'
              onClick=this.newNode
            )
              Add(className=classes.extendedIcon)
              | New Node
          Divider
        .content.node-cards
          =nodeCardsJSX

    `
  }
}

const styles = (theme) => {
  return {
    fab: {
      margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
  }
}

export default withStyles(styles)(Index)
