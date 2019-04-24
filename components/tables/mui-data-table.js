import MUIDataTable from 'mui-datatables'

export default class MyMUIDataTable extends MUIDataTable {
  constructor(props, context) {
    super(props, context)

    this.setState({
      searchText: props.searchText,
    })
  }
}
