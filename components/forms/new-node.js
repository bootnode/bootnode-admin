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

import { watch } from 'react-referential'

import isRequired from '../../src/control-middlewares/isRequired'
import isEmail from '../../src/control-middlewares/isEmail'
import isPassword from '../../src/control-middlewares/isPassword'

@watch('loginForm')
export default class LoginForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      password: new InputData({
        name: 'provider',
        middleware: [isRequired]
      }),
      email: new InputData({
        name: 'region',
        data: props.data,
        middleware: [isRequired]
      }),
      email: new InputData({
        name: 'zone',
        data: props.data,
        middleware: [isRequired]
      }),
    }

    this.emitter = props.emitter || new Emitter()
  }

  _submit = () => {
    this.emitter.trigger('login:success', {
      account: {
        id: 1,
      },
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
        MuiCheckbox(
          ...this.inputs.rememberMe
          label='Remember me on this device.'
        )
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        Button(type='submit' variant='outlined' size='large')
          | LOGIN
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}
