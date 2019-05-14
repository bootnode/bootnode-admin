import React from 'react'
import Router from 'next/router'
import BootNode from '../../src/bootnode/client'

export default class LoggedInPage extends React.Component {
  constructor(props, path='/') {
    super(props)

    this.path = path
  }

  componentDidMount() {
    let api = new BootNode()

    if (!api.isLoggedIn()) {
      Router.push(this.path)
      return
    }
  }
}
