import React from 'react'
import Router from 'next/router'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import LoggedInPage from '../../components/pages/logged-in'
import NodeCard from '../../components/node-card'
import Donut from '../../components/d3/donut'
import Map from '../../components/d3/map'
import NewNodeForm from '../../components/forms/new-node'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Link from '../../components/link'

import Add from '@material-ui/icons/Add'
import Language from '@material-ui/icons/Language'
import ScatterPlot from '@material-ui/icons/ScatterPlot'
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutlined'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import lightGreen from '@material-ui/core/colors/lightGreen'
import orange from '@material-ui/core/colors/orange'

import BootNode from '../../src/bootnode/client'
// import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
import { renderUIDate } from '../../src/util/date.js'

import Emitter from '../../src/emitter'
import capitalize from '../../src/string/capitalize'
import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import { startLoading, stopLoading } from '../../components/app/loader'

const REGIONS = {
  'us-central1': [-95.866667, 41.25],
  'europe-west6': [8.55, 47.366667],
  'asia-east2': [114.15769, 22.28552],
}

const HEALTH_COLORS = {
  Running: lightGreen[500],
  Pending: orange[500],
}

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
      { label:'Hanzo', value: 60, color: '#b17be0' },
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

      this.timeoutId = setTimeout(fn, 2000)
    }

    this.timeoutId = setTimeout(fn, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  async loadTable() {
    let api = new BootNode()

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

  newNode = async (data) => {
    this.hideNewNodeForm()
    startLoading(' ')
    try {
      let api = new BootNode()

      await api.request('PUT', 'nodes', data)
      await this.loadTable()
    } catch (e) {
      console.log('error', e)
    }
    stopLoading(' ')
  }

  deleteNode = ({id, zone}) => {
    return async () => {
      startLoading(' ')
      try {
        let api = new BootNode()

        await api.request('DELETE', 'nodes/' + id, {zone})
        await this.loadTable()
      } catch (e) {
      }
      stopLoading(' ')
    }
  }

  // Get the Lon/Lat plus radius of
  getMapPoints() {
    let { rows } = this.state

    let points = {}

    for (let k in rows) {
      let data = rows[k]

      // accumulate all the data
      let { zone } = data
      let region = zone.replace(/(-.+)-.+?$/ig, '$1')

      if (points[region]) {
        points[region].count++
      } else {
        points[region] = {
          region: REGIONS[region],
          count: 1,
        }
      }
    }

    let ps = []

    // spread out all the data
    for (let k in points) {
      let point = points[k]

      ps.push({
        point: point.region,
        count: point.count,
      })
    }

    return ps
  }

  getHealths() {
    let { rows } = this.state
    let healths = {}

    // Bootstrap health values and colors because the donut chart renderer has
    // a hard time with out of order renderings
    for (let status in HEALTH_COLORS) {
      healths[status] = {
        label: status,
        value: 0,
        color: HEALTH_COLORS[status],
      }
    }

    for (let k in rows) {
      let data = rows[k]

      let status = data.instances[0].status

      if (healths[status]) {
        healths[status].value += 1
      } else {
        healths[status] = {
          label: status,
          value: 1,
          color: HEALTH_COLORS[status],
        }
      }
    }

    let hs = []

    for (let k in healths) {
      let health = healths[k]

      hs.push(health)
    }

    return hs
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

    let points = this.getMapPoints()
    let healths = this.getHealths()

    let hs = []

    for (let k in healths) {
      let health = healths[k]

      hs.push(health.value + ' ' + health.label)
    }

    let healthStr = hs.join(', ')

    return pug`
      main#nodes.dash
        AppBar(className=classes.appBar)
          Toolbar(className=classes.breadcrumbs)
            Link(color='inherit' href='/' className=classes.breadcrumbLink)
              | Networks
            p(className=classes.breadcrumbLink) /
            Link(color='inherit' href='/' className=classes.breadcrumbLink)
              | CasperLabs - Testnet
            div(className=classes.flexGrow)
            Button(
              color='primary'
              onClick=this.showNewNodeForm
              size='small'
            )
              Add
              span(className=classes.launchText) Launch Node

        .content
          Card(className=classes.card)
            CardContent(className=classes.noPadding)
              .charts
                .chart.map
                  .chartTitle
                    Language
                    span='Deployed in ' + points.length + ' Locations'
                  Map(
                    width=600-32
                    height=250
                    data=points
                  )
                .chart
                  .chartTitle
                    ScatterPlot
                    span='40% Decentralized'
                  Donut(
                    data=this.data
                    width=250-32
                    height=250-32
                  )
                .chart
                  .chartTitle
                    CheckCircleOutlined
                    span=healthStr
                  Donut(
                    data=healths
                    width=250-32
                    height=250-32
                  )
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
    appBar: {
      top: 64,
      zIndex: 1202,
    },
    flexGrow: {
      flexGrow: 1,
    },
    noPadding: {
      padding: '0 !important'
    },
    breadcrumbs: {
      backgroundColor: 'white',
      minHeight: 48,
    },
    breadcrumbLink: {
      color: 'black',
      marginRight: '1rem',
    },
    fab: {
      margin: theme.spacing.unit,
    },
    launchText: {
      marginRight: theme.spacing.unit,
    },
    card: {
      borderRadius: 0,
    },
  }
}

export default withStyles(styles)(Index)
