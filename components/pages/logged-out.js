import React from 'react'
import Router from 'next/router'
import Api from '../../src/hanzo/api'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
import { loadLibrary } from '../../src/library'
import { isLoggedIn } from '../../src/account'

export default class LoggedOutPage extends React.Component {
  constructor(props, path = '/dash') {
    super(props)

    this.path = path
  }

  componentDidMount() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    loadLibrary(api.client)

    if (isLoggedIn()) {
      Router.push(this.path)
    }
  }
}
