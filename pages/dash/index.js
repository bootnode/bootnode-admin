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

const REGIONS = {
  'us-central1': [-95.866667, 41.25],
  'europe-west6': [8.55, 47.366667],
  'asia-east2': [114.15769, 22.28552],
}

const HEALTH_COLORS = {
  Running: green[500],
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
      { label:'Private Cloud', value: 60, color: '#b17be0' },
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
    }

    this.timeoutId = setTimeout(fn, 10000)
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

    if (healths.length == 0) {
      healths = [{
        label: 'Running',
        value: 1,
        color: green[500],
      }]
    }

    let hs = []

    for (let k in healths) {
      let health = healths[k]

      hs.push(health.value + ' ' + health.label)
    }

    let healthStr = hs.join(', ')

    return pug`
      main#nodes.dash
        .content
          .charts.columns
            Card(className=classes.flex2)
              CardHeader(
                title='Zones'
                subheader='Deployed in ' + points.length + ' Regions'
              )
              CardContent
                Map(
                  width=600
                  height=300
                  data=points
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
                subheader=healthStr
              )
              CardContent
                Donut(
                  data=healths
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
