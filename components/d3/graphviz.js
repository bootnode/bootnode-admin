import React, { Component } from 'react'

import { select } from 'd3-selection'
import graphviz from 'd3-graphviz'

export default class Map extends Component {
  constructor(props){
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.createViz()
  }

  componentDidUpdate() {
    let dataStr = JSON.stringify(this.props.data)

    if (dataStr != this.oldDataStr) {
      this.change(this.props.data)
      this.oldDataStr = dataStr
    }
  }

  async createViz() {
    this.svg = select(this.svgNode)

    this.change(this.props.data)
  }

  change(data) {
    this.svg.graphviz().renderDot(data)
  }

  render() {
    return pug`
      .d3.d3-graphviz(
        ref=(node)=>{ this.mapNode = node }
      )
        .d3-content(
          ref=(node)=>{ this.svgNode = node }
        )
    `
  }
}
