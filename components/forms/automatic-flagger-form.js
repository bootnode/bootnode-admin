import Form, { InputData } from './form'
import MUIText from '../controls/mui-text'
import MUIState from '../controls/mui-state'
import MUINumber from '../controls/mui-number'
import MUICountry from '../controls/mui-country'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import ref from 'referential'
import classnames from 'classnames'
import * as ethers from 'ethers'
import Api from '../../src/hanzo/api'
import Emitter from '../../src/emitter'
import MUITable, { ColumnData } from '../tables/mui-table'

import { watch } from '../../src/referential/provider'
import { withStyles } from '@material-ui/core/styles'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

import isRequired from '../../src/control-middlewares/isRequired'

let automaticFlaggerColumns = [
  new ColumnData('Created On'),
  new ColumnData('Name'),
  new ColumnData('IP'),
  new ColumnData('Amount'),
  new ColumnData('State'),
  new ColumnData('Country'),
]

@watch('automaticFlaggerForm')
class AutomaticFlaggerForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      name: new InputData({
        name: 'name',
        data: props.data,
        middleware: [isRequired]
      }),
      ip: new InputData({
        name: 'ip',
        data: props.data,
        middleware: [isRequired]
      }),
      amount: new InputData({
        name: 'Amount',
        data: props.data,
        middleware: [isRequired]
      }),
      country: new InputData({
        name: 'Country',
        data: props.data,
        middleware: [isRequired],
        value: 'US',
      }),
      state: new InputData({
        name: 'State',
        data: props.data,
        middleware: [isRequired],
        value: 'CA',
      }),
    }

    this.emitter = props.emitter || new Emitter()
  }

  _submit() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    // return api.client.dashv2.login({
    //   email: this.inputs.email.val(),
    //   password: this.inputs.password.val(),
    //   // client_id: this.inputs.organization.val(),
    //   // grant_type: 'password',
    // }).then((res) => {
    //   let p = this.inputs.password.val()

    //   this.inputs.password.val(this.inputs.password.val().replace(/./g, '•'))

    //   let i = this.inputs.email.val() + p

    //   this.emitter.trigger('login:success', {
    //     user: res.user,
    //     orgs: res.organizations,
    //     activeOrg: 0,
    //   })
    // })
  }

  render() {
    let { classes } = this.props

    let tableOpts = {
      print: false,
      search: false,
      filter: false,
      download: false,
      pagination: false,
      viewColumns: false,
      rowsPerPage: 100,
      page: 1,
    }

    return pug`
      Card
        CardContent
          h3 Automatic Flagging System
          br
          form.form(
            autoComplete=this.props.autoComplete
            onSubmit=this.submit
            className=classnames({
              validating: this.state.validating,
              loading: this.state.loading,
              submitted: this.state.submitted,
            })
          )
            .form-group.columns
              MUIText(
                ...this.inputs.name
                label='Name'
                variant='outlined'
              )
              MUIText(
                ...this.inputs.ip
                label='IP'
                variant='outlined'
              )
              MUINumber(
                ...this.inputs.amount
                label='Amount'
                variant='outlined'
              )
              MUIState(
                ...this.inputs.state
                label='State'
                variant='outlined'
                country=this.inputs.country.val()
              )
              MUICountry(
                ...this.inputs.country
                label='Country'
                variant='outlined'
              )
            if this.getErrorMessage()
              .error
                = this.getErrorMessage()
            Button(
              size='large'
              variant='outlined'
              type='submit'
            )
              | Save
            if this.state.loading || this.state.validating
              .progress
                .indeterminate
      MUITable(
        title=''
        columns=automaticFlaggerColumns
        rows=[]
        options=tableOpts
      )
    `
  }
}

let styles = theme => ({
  hugeButton: {
    padding: '15px 24px',
  }
})

export default withStyles(styles)(AutomaticFlaggerForm)
