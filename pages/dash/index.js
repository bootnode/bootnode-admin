import React from 'react'
import Router from 'next/router'
import LoggedInPage from '../../components/pages/logged-in'
import NodeCard from '../../components/node-card'
import Donut from '../../components/d3/donut'
import Map from '../../components/d3/map'
import NewNodeForm from '../../components/forms/new-node'
import Divider from '@material-ui/core/Divider'
import Fab from '@material-ui/core/Fab'
import Add from '@material-ui/icons/Add'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import green from '@material-ui/core/colors/green'
import orange from '@material-ui/core/colors/orange'

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
      showNewNodeForm: false,
    }

    let opts = this.props.data.get('search')
    if (!opts) {
      opts = {
        page: 1,
        display: 10,
      }

      this.props.data.set('search', opts)
    }

    this.data = [
      { label:'Google', value: 40, color: '#4285F4' },
      { label:'Private Cloud', value: 60, color: '#b17be0' },
    ]

    this.data2 = [
      { label:'Running', value: 6, color: green[500] },
      { label:'Pending', value: 1, color: orange[500] },
    ]
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

  showNewNodeForm = () => {
    this.setState({
      showNewNodeForm: true
    })
  }

  hideNewNodeForm = () => {
    this.setState({
      showNewNodeForm: false
    })
  }

  newNode = async (n = 1) => {
    this.hideNewNodeForm()
    startLoading(' ')
    try {
      let ps = []
      let api = new BootNode()

      for (let i = 0; i < n; i++) {
        ps.push(api.request('PUT', 'nodes'))
      }

      await Promise.all(ps)
      await this.loadTable()
    } catch (e) {
      console.log('error', e)
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
      showNewNodeForm,
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
          .charts.columns
            Card(className=classes.flex2)
              CardHeader(
                title='Zones'
                subheader='Present in 3 Regions, 6 Zones'
              )
              CardContent
                Map(
                  width=600
                  height=300
                )
            Card
              CardHeader(
                title='Decentralization'
                subheader='40% Decentralized'
              )
              CardContent
                Donut(
                  data=this.data
                  width=300
                  height=300
                )
            Card
              CardHeader(
                title='Node Health'
                subheader='6 Ready, 3 Pending'
              )
              CardContent
                Donut(
                  data=this.data2
                  width=300
                  height=300
                )
          Divider
          .buttons
            Fab(
              variant='extended'
              color='primary'
              onClick=this.showNewNodeForm
            )
              Add(className=classes.extendedIcon)
              | Launch Node
          Divider
        .content.node-cards
          =nodeCardsJSX
        Dialog(
          open=showNewNodeForm
          close=this.hideNewNodeForm
        )
          DialogTitle.new-node-dialog
            | Launch Node
          DialogContent
            NewNodeForm(
              data=this.props.rootData
              onSubmit=this.newNode
              onClose=this.hideNewNodeForm
            )

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
    flex2: {
      flex: '2 !important',
    },
  }
}

export default withStyles(styles)(Index)
