import React from 'react'
import Router from 'next/router'
import BootNode from '../../src/bootnode/client'

export default class LoggedOutPage extends React.Component {
  constructor(props, path='/dash') {
    super(props)

    this.path = path
  }

  componentDidMount() {
    let api = new BootNode()

    if (api.isLoggedIn()) {
      Router.push(this.path)
      return
    }
  }
}
