import React from 'react'

import ref from 'referential'

export class ColumnData  {
  constructor(id, jsx, fn = (x, y) => x, className='') {
    this.id = id
    this.jsx = jsx
    this.fn = fn
    this.className = className
  }
}

export default class Table extends React.Component {
  render() {
    let { columns, data } = this.props

    columns = columns || []
    data = data || []

    return (
      <table>
        <thead>
          <tr>
            { columns.map((column) => {
              const JSX = column.jsx
              if (typeof JSX == 'string') {
                return <th className={column.className} key={column.id}>{JSX}</th>
              }
              return <th className={column.className} key={column.id}><JSX /></th>
            })}
          </tr>
        </thead>
        <tbody>
          { data.map((row) => {
            const rRow = ref(row)
            return (
              <tr key={row.id}>
                { columns.map((column) => {
                  const JSX = column.fn(rRow.get(column.id), row)
                  return <td className={column.className} key={column.id}>{JSX}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
