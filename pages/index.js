import React from 'react'
import Router from 'next/router'
import LoggedOutPage from '../components/pages/logged-out'
import { watch } from '../src/referential/provider'
import LoginForm from '../components/forms/login'
import Emitter from '../src/emitter'
import { login } from '../src/account'

@watch('indexPage')
class Index extends LoggedOutPage {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.emitter.on('login:success', res => {
      login(res)
      this.login(res)
    })
  }

  login(res) {
    console.log(res)

    Router.push('/dash')
  }

  componentWillUnmount() {
    this.emitter.off('login:success')
  }

  render() {
    return pug`
      main#index.hero.columns
        .content.columns
          .login.rows
            h1 Login
            br
            LoginForm(
              data=this.props.data
              emitter=this.emitter
            )
    `
  }
}

export default Index
