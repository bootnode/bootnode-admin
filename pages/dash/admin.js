import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import DisclosureForm from '../../components/forms/disclosure-form'
import AutomaticFlaggerForm from '../../components/forms/automatic-flagger-form'
import LoggedInPage from '../../components/pages/logged-in'

import { watch } from '../../src/referential/provider'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

@watch('adminPage')
class Admin extends LoggedInPage {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    let { classes,  data  } = this.props

    return pug`
      main#user.dash
        .content.rows
          Card
            CardContent
              h3 Halt Trading
              br
              .buttons.columns
                Button(
                  className=classes.outlinedError
                  color='error'
                  variant='outlined'
                  size='large'
                )
                  | HALT ALL TRADING
                Button(
                  className=classes.outlinedError
                  color='error'
                  variant='outlined'
                  size='large'
                )
                  | HALT ETH TRADING
                Button(
                  className=classes.outlinedError
                  color='error'
                  variant='outlined'
                  size='large'
                )
                  | HALT EOS TRADING
          DisclosureForm
          AutomaticFlaggerForm
    `
  }
}

let styles = theme => ({
  /* Styles applied to the root element if `variant="outlined"` and `color="primary"`. */
  outlinedError: {
    color: theme.palette.error.main,
    border: `1px solid ${fade(theme.palette.error.main, 0.5)}`,
    '&:hover': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: fade(theme.palette.error.main, theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&$disabled': {
      border: `1px solid ${theme.palette.action.disabled}`,
    },
  },
})

export default withStyles(styles)(Admin)
