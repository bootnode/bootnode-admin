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
  'casper-2': 'Casper 0.2'
}

let providerOptions = {
  'private-cloud': 'Hanzo Private Cloud',
  'google': 'Google'
}


let regionOptions = {
  '': 'Select Region',
  'us-central1': 'us-central1',
  'eu-west6': 'europe-west6',
  'asia-east2': 'asia-east2',
}

let zoneOptions = {
  'us-central1': {
    '': 'Select Zone',
    'us-central1-a': 'us-central1-a',
  },
  'eu-west6': {
    '': 'Select Zone',
    'europe-west6-a': 'europe-west6-a',
  },
  'asia-east2': {
    '': 'Select Zone',
    'asia-east2-a': 'asia-east2-a',
  }
}

@watch('newNodeform')
export default class NewNodeForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      number: new InputData({
        name: 'number',
        data: props.data,
        middleware: [isRequired],
        defaultValue: 1,
      }),
      image: new InputData({
        name: 'image',
        data: props.data,
        middleware: [isRequired],
        defaultValue: 'casper-2',
      }),
      provider: new InputData({
        name: 'provider',
        data: props.data,
        middleware: [isRequired],
        defaultValue: 'private-cloud',
      }),
      region: new InputData({
        name: 'region',
        data: props.data,
        middleware: [isRequired],
        defaultValue: '',
      }),
      zone: new InputData({
        name: 'zone',
        data: props.data,
        middleware: [isRequired],
        defaultValue: '',
      }),
    }

    this.emitter = props.emitter || new Emitter()

    this.onSubmit = this.props.onSubmit
    this.onClose = this.props.onClose
  }

  _submit = () => {
    if (this.onSubmit) {
      this.onSubmit(this.props.data.get())
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
          )
          MuiText(
            ...this.inputs.image
            label='Image'
            variant='outlined'
            options=imageOptions
            select
          )
        .form-group
          MuiText(
            ...this.inputs.provider
            label='Provider'
            variant='outlined'
            options=providerOptions
            select
          )
        .form-group.columns
          MuiText(
            ...this.inputs.region
            label='Region'
            variant='outlined'
            options=regionOptions
            select
          )
          MuiText(
            ...this.inputs.zone
            label='Zone'
            variant='outlined'
            options=zoneOptions[this.inputs.region.val()]
            select
          )
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        .buttons.columns
          div
            Button(type='submit' color='primary' size='large')
              | Launch
          div
            Button(onClick=this.props.onClose size='large')
              | Cancel
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}
