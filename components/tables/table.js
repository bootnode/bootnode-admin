import React from 'react'
import ref from 'referential'

export class ColumnData  {
  constructor(id, jsx, fn = x => x) {
    this.id = id
    this.jsx = jsx
    this.fn = fn
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
                return <th key={column.id}>{JSX}</th>
              }
              return <th key={column.id}><JSX /></th>
            })}
          </tr>
        </thead>
        <tbody>
          { data.map((row) => {
            return (
              <tr key={row.id}>
                { columns.map((column) => {
                  const JSX = ref(row).get(column.id)
                  if (typeof JSX == 'string') {
                    return <td key={column.id}>{JSX}</td>
                  }
                  return <td key={column.id}><JSX /></td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
