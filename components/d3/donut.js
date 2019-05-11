import React, { Component } from 'react'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { pie, arc } from 'd3-shape'
import { select, mouse } from 'd3-selection'
import 'd3-transition'
import { interpolate } from 'd3-interpolate'

export default class Donut extends Component {
  static defaultProps = {
    prefix: '',
    postfix: ''
  }

  constructor(props){
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.createDonut()
  }

  componentDidUpdate() {
    let dataStr = JSON.stringify(this.props.data)

    if (dataStr != this.oldDataStr) {
      this.change(this.props.data)
      this.oldDataStr = dataStr
    }
  }

  createDonut() {
    let svg = this.svg = select(this.svgNode)
      .append('g')

    svg.append('g')
      .attr('class', 'slices')
    svg.append('g')
      .attr('class', 'labelName')
    svg.append('g')
      .attr('class', 'labelValue')
    svg.append('g')
      .attr('class', 'lines')

    let width = this.width = this.props.width || 500
    let height = this.height = this.props.height || 500
    let radius = this.radius = Math.min(width, height) / 2

    this.pie = pie()
      .sort(null)
      .value((d) => {
        return d.value
      })

    this.arc = arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4)

    this.outerArc = arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    this.legendRectSize = (radius * 0.05)
    this.legendSpacing = radius * 0.05

    this.div = select(this.ttNode).append('div').attr('class', 'toolTip')

    svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    this.change(this.props.data)
  }

  change(data) {
    let {
      svg,
      width,
      height,
      radius,
      pie,
      arc,
      outerArc,
      legendRectSize,
      legendSpacing,
      div,
    } = this

    let {
      prefix,
      postfix
    } = this.props

    let colorRange = data.map(x => x.color)
    let color = scaleOrdinal()
      .range(colorRange)

    /* ------- PIE SLICES -------*/
	let slice = svg.select('.slices')
	  .selectAll('path')
      .data(pie(data), (d) => d.data.label)

    slice.enter()
      .append('path')
      .style('fill', (d) => color(d.data.label))
      .attr('class', 'slice')

    slice
      .transition().duration(1000)
      .attrTween('d', function (d) {
        this._currentS = this._currentS || d
        let i = interpolate(this._currentS, d)
        this._currentS = i(0)
        return (t) => arc(i(t))
      })

    slice
      .on('mousemove', function(d) {
        let [x, y] = mouse(this)
        div.style('left', width/2 + x+10+'px')
        div.style('top', height/2 + y-25+'px')
        div.style('display', 'inline-block')
        div.html((d.data.label)+'<br>'+prefix+(d.data.value)+postfix)
      })

    slice
      .on('mouseout', (d) => div.style('display', 'none'))

    slice.exit()
      .remove()

    let legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        let height = legendRectSize + legendSpacing
        let offset =  height * color.domain().length / 2
        let horz = -3 * legendRectSize
        let vert = i * height - offset
        return 'translate(' + horz + ',' + vert + ')'
      })

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .attr('x', -legendRectSize - legendSpacing)
      .style('fill', color)
      .style('stroke', color)

    legend.append('text')
      .attr('x', 0)
      .attr('y', legendRectSize)
      .text((d) => d)

    /* ------- TEXT LABELS -------*/

    let midAngle = d => d.startAngle + (d.endAngle - d.startAngle)/2

    // let text = svg.select('.labelName').selectAll('text')
    //   .data(pie(data), d => d.data.label)

    // text.enter()
    //   .append('text')
    //   .attr('dy', '.35em')
    //   .text((d) => (d.data.label+': '+d.value+'%'))

    // text
    //   .transition().duration(1000)
    //   .attrTween('transform', (d) => {
    //     this._currentT = this._currentT || d
    //     let i = interpolate(this._currentT, d)
    //     this._currentT = i(0)
    //     return (t) => {
    //       let d2 = i(t)
    //       let pos = outerArc.centroid(d2)
    //       pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1)
    //       return 'translate('+ pos +')'
    //     }
    //   })
    //   .styleTween('text-anchor', (d) => {
    //     this._currentT = this._currentT || d
    //     let i = interpolate(this._currentT, d)
    //     this._currentT = i(0)
    //     return (t) => {
    //       let d2 = i(t)
    //       return midAngle(d2) < Math.PI ? 'start':'end'
    //     }
    //   })
    //   .text(d => d.data.label+': '+d.value+'%')


    // text.exit()
    //   .remove()

    /* ------- SLICE TO TEXT POLYLINES -------*/

    // console.log(pie(data))

    // let polyline = svg.select('.lines').selectAll('polyline')
    //   .data(pie(data), d => d.data.label)

    // polyline.enter()
    //   .append('polyline')

    // polyline.transition().duration(1000)
    //   .attrTween('points', (d) => {
    //     this._currentP = this._currentP || d
    //     let i = interpolate(this._currentP, d)
    //     this._currentP = i(0)
    //     return (t) => {
    //       let d2 = i(t)
    //       let pos = outerArc.centroid(d2)
    //       pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1)
    //       return [arc.centroid(d2), outerArc.centroid(d2), pos]
    //     }
    //   })

    // polyline.exit()
    //   .remove()
  }

  render() {
    return pug`
      .d3.d3-donut
        .d3-content(
          style={
            width:  this.props.width,
            height: this.props.height,
          }
        )
          svg(
            ref=(node)=>{ this.svgNode = node }
          )
        .tooltip(
          ref=(node)=>{ this.ttNode = node }
        )
    `
  }
}
