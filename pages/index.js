import React from 'react'
import Router from 'next/router'
import { watch } from 'react-referential'
import LoginForm from '../components/forms/login'
import LoggedOutPage from '../components/pages/logged-in'
import Emitter from '../src/emitter'
import BootNode from '../src/bootnode/client'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { startLoading, stopLoading } from '../components/app/loader'

@watch('loginPage')
class LoginPage extends LoggedOutPage {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.emitter.on('login:success', res => {
      this.login()
    })
  }

  login() {
    startLoading(' ')
    Router.push('/dash')
  }

  componentWillUnmount() {
    this.emitter.off('login:success')
  }

  render() {
    return pug`
      main#index
        .login-form.content.columns
          Card
            CardContent
              h2 Login
              LoginForm(
                data=this.props.data
                emitter=this.emitter
              )
    `
  }
}

export default LoginPage
