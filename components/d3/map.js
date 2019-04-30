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

    let svg = select(this.svgNode)

    let projection = geoMercator().translate([width*.49, height*.63]).scale(95)

    let path = geoPath().projection(projection)

    let url = '/static/geo.json'

    let geoJson = await json(url)

    svg.append('path').attr('d', path(geoJson)).attr('fill', '#81d4fa').attr('stroke', '#ffffff')

    let point = [-77.4360, 37.5407]
      svg.selectAll('circle')
		.data([point]).enter()
		.append('circle')
		.attr('cx', function (d) { console.log('projection', projection(d)); return projection(d)[0]; })
		.attr('cy', function (d) { return projection(d)[1]; })
		.attr('r', '4px')
		.attr('fill', green[500])
	    .attr('stroke', '#fff')
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

