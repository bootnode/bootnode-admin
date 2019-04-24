import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import NAVForm from '../../components/forms/nav-form'
import LoggedInPage from '../../components/pages/logged-in'

import { watch } from '../../src/referential/provider'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

@watch('fundPage')
export default class Fund extends LoggedInPage {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    let { data } = this.props

    return pug`
      main#user.dash
        .content.rows
          NAVForm
    `
  }
}
