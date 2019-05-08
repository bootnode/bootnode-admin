import React, { Component } from 'react'
import { select } from 'd3-selection'
import { geoPath, geoMercator } from 'd3-geo'
import { json } from 'd3-fetch'
import green from '@material-ui/core/colors/green'

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

    let svg = this.svg = select(this.svgNode)

    let projection = this.projection = geoMercator().translate([width*.49, height*.63]).scale(95)

    let path = geoPath().projection(projection)

    let url = '/static/geo.json'

    let geoJson = await json(url)

    svg.append('path').attr('d', path(geoJson)).attr('fill', '#81d4fa').attr('stroke', '#ffffff')

    this.change(this.props.data)
  }

  change(data) {
    let projection = this.projection

    this.svg.selectAll('circle')
      .data(data).enter()
      .append('circle')
      .attr('cx', function (d) { return projection(d.point)[0]; })
      .attr('cy', function (d) { return projection(d.point)[1]; })
      .attr('r', function(d) { return Math.sqrt(d.count * 4 + 12) } )
      .attr('fill', green[500])
      .attr('stroke', '#fff')
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

