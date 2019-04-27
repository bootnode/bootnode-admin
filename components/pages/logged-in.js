import React from 'react'
import Router from 'next/router'
// import Api from '../../src/hanzo/api'
// import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
// import { loadLibrary } from '../../src/library'
// import { isLoggedIn, getOrg, logout } from '../../src/account'

export default class LoggedInPage extends React.Component {
  constructor(props, path='/') {
    super(props)

    this.path = path
  }

  componentDidMount() {
    // if (!isLoggedIn()) {
    //   Router.push(this.path)
    //   return
    // }

    // Test if the user is actually logged in
    let foo = () => {
      // let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

      // // Keep library up to date
      // loadLibrary(api.client)

      // let org = getOrg()

      // return api.client.organization.get(org.id).then((res) => {
      //   console.log('User is still logged in.')
      // }).catch((err) => {
      //   console.log('User was logged out.')

      //   logout()
      //   api.client.deleteCustomerToken()

      //   Router.push(this.path)
      // })

      setTimeout(foo, 300000)
    }

    foo()
  }
}
