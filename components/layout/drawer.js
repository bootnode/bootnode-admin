import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import GroupIcon from '@material-ui/icons/Group'
import SendIcon from '@material-ui/icons/Send'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import PowerSettingsIcon from '@material-ui/icons/PowerSettingsNew'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import Link from '../link'

import { withStyles } from '@material-ui/core/styles'
import {
  getOrg,
} from '../../src/account'

let drawerWidth = 200

class MyDrawer extends React.Component {
  render() {
    let { classes, ...props } = this.props

    let identity = getOrg()
    let accountLoaded = !!identity

    return pug `
      if false && accountLoaded
        Drawer(
          ...props
          className=classes.drawer
          classes={
            paper: classes.drawerPaper,
          }
        )
          div(className=classes.toolbar)
          List(className=classes.marginTop)
            ListItem
              ListItemIcon(className=classes.noMargin)
                Link.columns(href='/dash' color='textPrimary' underline='none')
                  GroupIcon
              ListItemText
                Link(href='/dash' color='textPrimary' underline='none')
                  | Nodes
    `
  }
}

const styles = (theme) => {
  return {
    noMargin: {
      margin: 0,
    },
    toolbar: theme.mixins.toolbar,
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    rotated: {
      transform: 'rotate(-45deg)',
    },
    marginTop: {
      marginTop: '1rem',
    },
  }
}

export default withStyles(styles)(MyDrawer)

