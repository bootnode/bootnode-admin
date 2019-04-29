import React, { Component } from 'react'
import { select } from 'd3-selection'
import { geoPath, geoMercator } from 'd3-geo'
import { json } from 'd3-fetch'

export default class Map extends Component {
  constructor(props){
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.createMap()
  }

  componentDidUpdate() {
    this.change(this.props.data)
  }

  async createMap() {
    let width = this.props.width || 1000
    let height = this.props.height || 500

    let svg = select(this.svgNode)

    let projection = geoMercator().translate([width/2, height*3/5]).scale(95)

    let path = geoPath().projection(projection)

    let url = '/static/geo.json'

    let geoJson = await json(url)

    svg.append('path').attr('d', path(geoJson)).attr('fill', '#81d4fa').attr('stroke', '#ffffff')
  }

  change(data) {
  }

  render() {
    return pug`
      .d3.d3-map(
        ref=(node)=>{ this.mapNode = node }
      )
        .d3-content(
          style={
            width:  this.props.width,
            height: this.props.height,
          }
        )
          svg(
            ref=(node)=>{ this.svgNode = node }
          )
    `
  }
}

