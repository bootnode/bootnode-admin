import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Router from 'next/router'
import Link from '../link'

import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import Send from '@material-ui/icons/Send'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import {
  getOrg,
} from '../../src/account'

@watch('footer')
class Footer extends React.Component {
  render() {
    let { classes, ...props } = this.props
    let identity = getOrg()

    let accountLoaded = !!this.props.rootData.get('account.id') && identity

    return pug`div`
  }
}

const styles = (theme) => {
  return {
    flex1: {
      flex: 1,
      textAlign: 'center',
      padding: 2 * theme.spacing.unit,
    },
    noPadding: {
      padding: 0,
    },
    rotated: {
      transform: 'rotate(-45deg)',
      position: 'relative',
      left: '3px',
    },
    blockLink: {
      display: 'block',
    },
  }
}

export default withStyles(styles)(Footer)

