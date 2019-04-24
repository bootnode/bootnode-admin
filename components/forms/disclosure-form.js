import Form, { InputData } from './form'
import MUIText from '../../components/controls/mui-text'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import ref from 'referential'
import classnames from 'classnames'
import * as ethers from 'ethers'
import Api from '../../src/hanzo/api'
import Emitter from '../../src/emitter'
import MUITable, { ColumnData } from '../../components/tables/mui-table'

import { watch } from '../../src/referential/provider'
import { withStyles } from '@material-ui/core/styles'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

import isRequired from '../../src/control-middlewares/isRequired'

let disclosureColumns = [
  new ColumnData('Created On'),
  new ColumnData('Name'),
  new ColumnData('Event'),
]

@watch('disclosureForm')
class DisclosureForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      name: new InputData({
        name: 'name',
        data: props.data,
        middleware: [isRequired]
      }),
      event: new InputData({
        name: 'event',
        data: props.data,
        middleware: [isRequired]
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
          h3 Disclosures
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
                ...this.inputs.event
                label='Event'
                variant='outlined'
              )
              Button(
                className=classes.hugeButton
                variant='outlined'
                type='submit'
              )
                | Upload Disclosure
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
        columns=disclosureColumns
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

export default withStyles(styles)(DisclosureForm)
