import Form, {
  InputData,
  MuiText,
  MuiCheckbox,
  Emitter,
} from 'react-referential-forms'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import ref from 'referential'
import classnames from 'classnames'
import BootNode from '../../src/bootnode/client'

import { watch } from 'react-referential'

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
      })
    }

    this.emitter = props.emitter || new Emitter()
  }

  async _submit() {
    let api = new BootNode()

    try {
      let token = await api.login({
        email: this.inputs.email.val(),
        password: this.inputs.password.val(),
      })

      this.emitter.trigger('login:success', {
        token: token,
      })
    } catch (e) {
      console.log('login form submit error: ' + e)
    }
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
          MuiText(
            ...this.inputs.email
            label='Email'
            variant='outlined'
          )
        .form-group
          MuiText(
            ...this.inputs.password
            label='Password'
            variant='outlined'
            type='password'
          )
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        Button.button(color='primary' type='submit' variant='contained')
          | LOGIN
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}

