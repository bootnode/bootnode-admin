import Form, {
  InputData,
  MuiText,
  MuiCheckbox,
  Emitter,
} from 'react-referential-forms'
import Button from '@material-ui/core/Button'

import ref from 'referential'
import classnames from 'classnames'

import { watch } from 'react-referential'

import isRequired from '../../src/control-middlewares/isRequired'

let imageOptions = {
  'casper-2': 'Casper 2.0'
}

let providerOptions = {
  'private-cloud': 'Hanzo Private Cloud',
  'google': 'Google'
}


let regionOptions = {
  'us-east': 'us-east'
}

let zoneOptions = {
  'us-east-4': 'us-east-4'
}

@watch('newNodeform')
export default class NewNodeForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      number: new InputData({
        name: 'number',
        middleware: [isRequired]
      }),
      image: new InputData({
        name: 'image',
        middleware: [isRequired]
      }),
      provider: new InputData({
        name: 'provider',
        middleware: [isRequired]
      }),
      region: new InputData({
        name: 'region',
        data: props.data,
        middleware: [isRequired]
      }),
      zone: new InputData({
        name: 'zone',
        data: props.data,
        middleware: [isRequired]
      }),
    }

    this.emitter = props.emitter || new Emitter()

    this.onSubmit = this.props.onSubmit
    this.onClose = this.props.onClose
  }

  _submit = () => {
    if (this.onSubmit) {
      this.onSubmit(this.inputs.number.val())
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
            ...this.inputs.number
            label='Number'
            variant='outlined'
            options=imageOptions
            value=1
          )
          MuiText(
            ...this.inputs.image
            label='Image'
            variant='outlined'
            options=imageOptions
            value='casper-2'
            select
          )
        .form-group
          MuiText(
            ...this.inputs.provider
            label='Provider'
            variant='outlined'
            options=providerOptions
            value='private-cloud'
            select
          )
        .form-group.columns
          MuiText(
            ...this.inputs.region
            label='Region'
            variant='outlined'
            options=regionOptions
            value='us-east'
            select
          )
          MuiText(
            ...this.inputs.zone
            label='Zone'
            variant='outlined'
            options=zoneOptions
            value='us-east-4'
            select
          )
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        .buttons.columns
          div
            Button(type='submit' variant='contained' color='primary' size='large')
              | Launch
          div
            Button(onClick=this.props.onClose variant='contained' size='large')
              | Cancel
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}
