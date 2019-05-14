import React from 'react'
import Router from 'next/router'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import LoggedInPage from '../../components/pages/logged-in'
import NodeCard from '../../components/node-card'
import Table, { ColumnData } from '../../components/tables/table'
import Donut from '../../components/d3/donut'
import Map from '../../components/d3/map'
import GraphViz from '../../components/d3/graphviz'
import NewNodeForm from '../../components/forms/new-node'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Link from '../../components/link'

import Add from '@material-ui/icons/Add'
import Language from '@material-ui/icons/Language'
import ScatterPlot from '@material-ui/icons/ScatterPlot'
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutlined'
import Fingerprint from '@material-ui/icons/Fingerprint'
import CloudDoneOutlined from '@material-ui/icons/CloudDoneOutlined'
import LinkIcon from '@material-ui/icons/Link'
import Public from '@material-ui/icons/Public'
import Label from '@material-ui/icons/LabelOutlined'
import DNS from '@material-ui/icons/Dns'
import Timer from '@material-ui/icons/Timer'
import Settings from '@material-ui/icons/Settings'
import Delete from '@material-ui/icons/Delete'
import Timeline from '@material-ui/icons/Timeline'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import lightGreen from '@material-ui/core/colors/lightGreen'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'

import BootNode from '../../src/bootnode/client'
import Casper from '../../src/casper/client'
// import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
import { renderUIDate } from '../../src/util/date.js'

import Emitter from '../../src/emitter'
import capitalize from '../../src/string/capitalize'
import { withStyles } from '@material-ui/core/styles'
import { watch } from 'react-referential'
import { startLoading, stopLoading } from '../../components/app/loader'
import classnames from 'classnames'

const NODE_COLUMNS = (obj) => {
  return [
    new ColumnData(
      'instances.0.status',
      CheckCircleOutlined,
      x => pug`span.node-status(className=classnames({ ready: x=='Running', pending: x=='Pending' }))`
    ),
    new ColumnData('id', Fingerprint),
    new ColumnData('blockchain', Label, (x, y) => x + '-' + y.network),
    new ColumnData('zone', Public),
    new ColumnData('ip', CloudDoneOutlined),
    new ColumnData('metadata.block.blockHash', DNS, x => x, 'too-long'),
    new ColumnData('latencyMillis', Timer, (x) => {
      let ms = parseInt(x, 10)
      return isNaN(ms) ? 'n/a' : '' + ms + 'ms'
    }),
    new ColumnData('id', Settings, (x, y) => {
      return pug`
        if y.metadata && y.metadata.dag
          IconButton(size='small' color='primary' onClick=obj.showDag(y))
            Timeline
        IconButton(size='small' color='primary' onClick=obj.deleteNode(y))
          Delete
      `
    }),
    // new ColumnData('ports', LinkIcon, x => (x && x.map) ? x.map(y => y.name + ': ' + y.port).join(', ') : ''),
  ]
}

const REGIONS = {
  'us-central1': [-95.866667, 41.25],
  'europe-west6': [8.55, 47.366667],
  'asia-east2': [114.15769, 22.28552],
  'test': [-94.5786, 39.0997],
}

const HEALTH_COLORS = {
  // Staked: blue[500],
  Running: lightGreen[500],
  Pending: orange[500],
  Deleting: red[500],
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
      showDag: false,
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
    super.componentDidMount()

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

    let { data } = await api.request('GET', 'nodes')

    // let ps = []
    // for (let k in data) {
    //   let row = data[k]

    //   if (!row.ip) {
    //     ps.push(async () => {})
    //     continue
    //   }

    //   let api2 = new Casper('https://' + row.ip)

    //   let fn = async () => {
    //     let start = new Date().getMilliseconds()
    //     let val = await api2.request('PUT', 'show/blocks', {depth: 1})
    //     return {
    //       blockData: val,
    //       startTime: start,
    //       endTime: new Date().getMilliseconds()
    //     }
    //   }

    //   ps.push(fn())
    // }

    // let blockDatas = await Promise.all(ps)

    // for (let k in data) {
    //   let row = data[k]
    //   let blockData = blockDatas[k]

    //   row.latency = blockData.endTime - blockData.startTime
    //   row.blockHash = blockData.blockHash
    // }

    for (let k in data) {
      let row = data[k]

      if (!row.ip) {
        if (row.instances[0]) {
          row.instances[0].status = 'Pending'
        } else {
          row.instances = [{status: 'Pending'}]
        }
      }
    }

    this.setState({
      rows: data,
      count: data.length,
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

  showDag = ({id, metadata}) => {
    return () => {
      this.setState({
        currentDag: { id: id, content: metadata.dag.content },
        showDag: true,
      })
    }
  }

  hideDag = () => {
    this.setState({
      currentDag: null,
      showDag: false,
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

  deleteNode = ({id, zone, provider}) => {
    return async () => {
      startLoading(' ')
      try {
        let api = new BootNode()

        await api.request('DELETE', 'nodes/' + id, {zone, provider})
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
      showDag,
      currentDag,
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

    let running = 0
    let total = 0
    for (let k in healths) {
      let health = healths[k]

      if (health.label == 'Running') {
        running = health.value
      }

      total += health.value
    }

    let healthStr = '' +  running + '/' + total + ' Running'

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
          Paper(square=true)
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
        .content
          Paper(square=true)
            .node-table
              Table(
                data=rows
                columns=NODE_COLUMNS(this)
              )
        // .content.node-cards
        //   =nodeCardsJSX
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
        Dialog(
          open=showDag
          close=this.hideDag
        )
          if currentDag
            DialogTitle.dag-dialog
              =currentDag.id + ' DAG'
            DialogContent
              GraphViz(data=currentDag.content)
            DialogActions
              Button(onClick=this.hideDag color='primary')
                | Close

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
  }
}

export default withStyles(styles)(Index)
