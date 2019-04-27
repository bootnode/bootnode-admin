import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import SearchIcon from '@material-ui/icons/Search'
import Link from '../link'
import Form, { InputData, MuiInput } from 'react-referential-forms'
import Router from 'next/router'

import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
// import {
//   getOrg,
//   setActiveOrg,
//   getActiveOrg,
//   getOrgs,
//   logout,
// } from '../../src/account'

// import Api from '../../src/hanzo/api'
// import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
import * as qs from 'query-string'

import isRequired from '../../src/control-middlewares/isRequired'

@watch('header')
class Header extends Form {
  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
    }

    this.inputs = {
      search: new InputData({
        name: 'search',
        data: props.data,
        middleware: [isRequired],
      }),
    }
  }

  componentDidMount() {
    let query = qs.parse(window.location.search)
    this.props.data.set('search', query.q)
  }

  handleMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    })
  }

  // getOrgs = () => {
  //   return getOrgs().map((v) => {
  //     return v.fullName
  //   })
  // }

  logout = () => {
    this.setState({
      anchorEl: null,
    })

    // logout()
    // let api = new Api( HANZO_KEY, HANZO_ENDPOINT )
    // api.client.deleteCustomerToken()

    Router.push('/')
  }

  _submit() {
    Router.push('/dash/search?q=' + this.inputs.search.val())
  }

  render() {
    let { classes, ...props } = this.props
    // let identity = getOrg()
    let accountLoaded = true // !!identity

    let open = !!this.state.anchorEl

    return pug`
        if accountLoaded
          AppBar(
            className=classes.root
            position='fixed'
            color='primary'
          )
            Toolbar(className=classes.toolbar)
              Link.columns.logo(href='/')
                h3 BOOTNODE
              div(className=classes.search)
              // form(
              //   className=classes.search
              //   onSubmit=this.submit
              // )
              //   IconButton(className=classes.searchIcon type='submit')
              //     SearchIcon
              //   MuiInput(
              //     ...this.inputs.search
              //     changeNotBlur=true
              //     placeholder='Search...'
              //     value=this.props.data.get('search')
              //     classes={
              //       root: classes.inputRoot,
              //       input: classes.inputInput,
              //     }
              //   )
              IconButton(
                className=classes.flex0
                aria-owns=(open ? 'menu-appbar' : undefined)
                aria-haspopup='true'
                onClick=this.handleMenu
                color='inherit'
              )
                AccountCircle(style={ fontSize: 36 })
              Menu(
                id='menu-appbar'
                anchorEl=this.state.anchorEl
                anchorOrigin={
                  vertical: 'bottom',
                  horizontal: 'right',
                }
                transformOrigin={
                  vertical: 'bottom',
                  horizontal: 'right',
                }
                open=open
                onClose=this.handleClose
              )
                MenuItem(onClick=this.logout) Logout
    `
  }
}

const styles = (theme) => {
  return {
    root: {
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      padding: 0,
      paddingLeft: theme.spacing.unit * 2,
    },
    logoImg: {
      maxHeight: 36,
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    flex0: {
      flex: 0,
    },
    search: {
      flexGrow: 1,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing.unit * 2,
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit * 3,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      color: 'white'
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
  }
}

export default withStyles(styles)(Header)
