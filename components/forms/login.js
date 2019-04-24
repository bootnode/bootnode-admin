import Form, { InputData } from './form'
import MUIText from '../../components/controls/mui-text'
import MUICheckbox from '../controls/mui-checkbox'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import ref from 'referential'
import classnames from 'classnames'
import * as ethers from 'ethers'
import Api from '../../src/hanzo/api'
import Emitter from '../../src/emitter'

import { watch } from '../../src/referential/provider'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

import isRequired from '../../src/control-middlewares/isRequired'
import isEmail from '../../src/control-middlewares/isEmail'
import isPassword from '../../src/control-middlewares/isPassword'

@watch('loginForm')
export default class LoginForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      email: new InputData({
        name: 'email',
        data: props.data,
        middleware: [isRequired, isEmail]
      }),
      password: new InputData({
        name: 'password',
        middleware: [isRequired, isPassword]
      }),
      rememberMe: new InputData({
        name: 'rememberMe',
        data: props.data,
        defaultValue: false
      })
    }

    this.emitter = props.emitter || new Emitter()
  }

  _submit() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    return api.client.dashv2.login({
      email: this.inputs.email.val(),
      password: this.inputs.password.val(),
      // client_id: this.inputs.organization.val(),
      // grant_type: 'password',
    }).then((res) => {
      let p = this.inputs.password.val()

      this.inputs.password.val(this.inputs.password.val().replace(/./g, '•'))

      let i = this.inputs.email.val() + p

      this.emitter.trigger('login:success', {
        user: res.user,
        orgs: res.organizations,
        activeOrg: 0,
      })
    })
  }

  render() {
    return pug`
      form.form(
        autoComplete=this.props.autoComplete
        onSubmit=this.submit
        className=classnames({
          validating: this.state.validating,
          loading: this.state.loading,
          submitted: this.state.submitted,
        })
      )
        .form-group
          MUIText(
            ...this.inputs.email
            label='Email'
            variant='outlined'
          )
        .form-group
          MUIText(
            ...this.inputs.password
            label='Password'
            variant='outlined'
            type='password'
          )
        .form-group
          MUICheckbox(
            ...this.inputs.rememberMe
          )
            span Remember Me
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        Button(
          size='large'
          variant='outlined'
          type='submit'
        )
          | LOGIN
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}
