import React from 'react'
import UserForm from '../../components/forms/user-form'
import LoggedInPage from '../../components/pages/logged-in'

import { watch } from '../../src/referential/provider'

@watch('userPage')
class User extends LoggedInPage {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    let data = this.props.data

    return pug`
      main#user.dash
        .content.rows
          UserForm(data=data)
    `
  }
}

export default User
