import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Divider from '@material-ui/core/Divider'
import { MuiText } from 'react-referential-forms'

import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import orange from '@material-ui/core/colors/orange'
import classnames from 'classnames'

class NodeCard extends React.Component {
  render() {
    let { classes, data, onDelete, ...props }= this.props
    console.log('Node Card Data', data)

    let status = data.instances[0].status

    let statusColor = pug`
      Avatar(
        className=classnames({
          [classes.green]: status === 'Running',
          [classes.orange]: status !== 'Running',
        })
      )
    `

    return pug `
      Card.node-card(...props)
        CardHeader.node-card-header(
          avatar=statusColor
          title=data.id
          subheader=status
        )
        CardContent.node-card-content
          MuiText(
            readOnly
            value=data.ip || 'Waiting For IP'
            label='IP Address'
            variant='outlined'
          )
          br
          MuiText(
            readOnly
            value=data.ports.join(', ')
            label='Ports'
            variant='outlined'
          )
          .host
            | Hosted by Google
          small us-east, zone-2
          Divider
        CardActions
          Button(size='small' color='primary' onClick=onDelete(data.id))
            | Delete
    `
  }
}

const styles = (theme) => {
  return {
    orange: {
      background: orange[500]
    },
    green: {
      background: green[500]
    },
  }
}

export default withStyles(styles)(NodeCard)

