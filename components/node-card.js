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
import lightGreen from '@material-ui/core/colors/lightGreen'
import orange from '@material-ui/core/colors/orange'
import classnames from 'classnames'

class NodeCard extends React.Component {
  render() {
    let { classes, data, onDelete, ...props }= this.props

    let status = data.instances[0].status

    let statusColor = pug`
      Avatar(
        className=classnames({
          [classes.lightGreen]: status === 'Running',
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
            value=data.ports && data.ports.map(x => x.name + ': ' + x.port).join(', ')
            label='Ports'
            variant='outlined'
          )
          .host
            | Hosted by Google
          small=data.zone
          Divider
        CardActions
          Button(size='small' color='primary' onClick=onDelete(data))
            | Delete
    `
  }
}

const styles = (theme) => {
  return {
    orange: {
      background: orange[500]
    },
    lightGreen: {
      background: lightGreen[500]
    },
  }
}

export default withStyles(styles)(NodeCard)

