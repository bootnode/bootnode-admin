import Form, { InputData } from './form'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import MUIText from '../../components/controls/mui-text'
import MUISwitch from '../../components/controls/mui-switch'
import MUITable, { ColumnData } from '../../components/tables/mui-table'

import Api from '../../src/hanzo/api'
import EthApi from '../../src/eth/api'
import EosApi from '../../src/eos/api'
import {
  HANZO_KEY,
  HANZO_ENDPOINT,
  EOS_TOKEN_ACCOUNT,
  EOS_TEST_ACCOUNT,
  ETH_TOKEN_ADDRESS,
  ETH_REGISTRY_ADDRESS,
} from '../../src/settings.js'
import BigNumber from 'bignumber.js'

import { watch } from '../../src/referential/provider'
import { startLoading, stopLoading } from '../../components/app/loader'
import { renderUIDate } from '../../src/util/date'
import formatPhone from '../../src/string/formatPhone'
import formatSSN from '../../src/string/formatSSN'
import * as qs from 'query-string'

const ETH_CONVERSION = new BigNumber(10e17)

let statusOpts = {
  initiated: 'Initiated',
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
}

let openImage = (src) => {
  return () => {
    let img = new Image()
    img.src = src
    let w = window.open('', '_blank')
    w.document.write(img.outerHTML)
  }
}

let documentColumns = [
  new ColumnData('Name'),
  new ColumnData('View', 'link', null, v => pug`p.pointer(onClick=openImage(v)) View`),
  new ColumnData('Download', 'link', null, v => pug`p.pointer(onClick=openImage(v)) Download`),
]

let addressColumns = [
  new ColumnData('Address'),
  new ColumnData('Blockchain'),
  new ColumnData('Amount'),
]

let transactionColumns = [
  new ColumnData('Issued On', 'issuedOn'),
  new ColumnData('Filename'),
]

let disclosureColumns = [
  new ColumnData('Issued On', 'issuedOn'),
  new ColumnData('Filename'),
]

@watch('userForm')
class UserForm extends Form {
  constructor(props) {
    super(props)

    this.state = {
      ethBalance: '0.0000',
      eosBalance: '0.0000',
    }
    this.props.data.clear()
  }

  componentDidMount() {
    startLoading('Loading User')

    let query = qs.parse(window.location.search)
    this.setState({id: query.id})

    this.loadUser(query.id).then(() => {
      stopLoading()
    }).catch((err) => {
      console.log('user error', err)
      stopLoading()
    })
  }

  loadUser(id) {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    return api.client.user.get(id || this.state.id).then((res) => {
      this.props.data.set(res)

      if (res.kyc && res.kyc.ethereumAddress) {
        let ethApi = new EthApi(ETH_TOKEN_ADDRESS, ETH_REGISTRY_ADDRESS, '', res.kyc.ethereumAddress)
        let ethP = ethApi.balanceOf().then((res) => {
          this.setState({
            ethBalance: new BigNumber(res).dividedBy(ETH_CONVERSION).toFormat(4)
          })
        })
      }

      if (res.kyc && res.kyc.eosPublicKey) {
        let eosApi = new EosApi(EOS_TOKEN_ACCOUNT, [], EOS_TEST_ACCOUNT)
        let eosP = eosApi.balanceOf().then((res) => {
          this.setState({
            eosBalance: new BigNumber(res).toFormat(4)
          })
        })
      }

      return res
    })
  }

  getDocuments() {
    let { kyc } = this.props.data.get()

    if (!kyc.documents) {
      return []
    }

    return [{
      name: 'Face',
      link: kyc.documents[0]
    },
    {
      name: 'ID Front',
      link: kyc.documents[1]
    },
    {
      name: 'ID Back',
      link: kyc.documents[2]
    }]
  }

  getAddresses() {
    let { kyc } = this.props.data.get()

    let addresses = []
    if (kyc.ethereumAddress) {
      addresses.push({
        address: kyc.ethereumAddress,
        blockchain: 'Ethereum',
        amount: this.state.ethBalance,
      })
    }

    if (kyc.eosPublicKey) {
      addresses.push({
        address: kyc.eosPublicKey,
        blockchain: 'EOS',
        amount: this.state.eosBalance,
      })
    }

    return addresses
  }

  getTransactions() {
  }

  getDisclosures() {
  }

  render() {
    let data = this.props.data.get()

    let tableOpts = {
      print: false,
      search: false,
      filter: false,
      download: false,
      pagination: false,
      viewColumns: false,
      rowsPerPage: 10,
      page: 1,
    }

    return pug`
      if data
        Card
          CardContent
            form.columns.align-flex-center(onSubmit=this.submit)
              if data.kyc.documents
                .column
                  img(src=data.kyc.documents[0])
              .columns.align-flex-start
                .column
                  small Name
                  p
                    =data.firstName + ' ' + data.lastName
                  br
                  small Id
                  p
                    =data.id
                  br
                  small Email
                  p
                    =data.email
                  br
                  small Phone
                  p
                    =formatPhone(data.kyc.phone)
                  br
                  small Address
                  p
                    =data.kyc.address.line1
                  if data.kyc.address.line2
                    p
                      =data.kyc.address.line2
                  p
                    =data.kyc.address.city + ', ' + data.kyc.address.state + ' ' + data.kyc.address.postalCode
                .column
                  MUIText(
                    select
                    label='Status'
                    options=statusOpts
                    value=data.kyc.status
                  )
                  br
                  .columns
                    MUISwitch(
                      label='Flagged'
                      color='primary'
                    )
                    MUISwitch(
                      label='Frozen'
                      color='primary'
                    )
                  br
                  small Birth Date
                  p
                    =renderUIDate(data.kyc.birthdate)
                  br
                  small Tax ID
                  p
                    =formatSSN(data.kyc.taxId)
                  br
                  small Date Registered
                  p
                    =renderUIDate(data.createdAt)
        MUITable(
          title='Documents'
          columns=documentColumns
          rows=this.getDocuments()
          options=tableOpts
        )
        MUITable(
          title='Addresses'
          columns=addressColumns
          rows=this.getAddresses()
          options=tableOpts
        )
        MUITable(
          title='Transactions'
          columns=transactionColumns
          rows=this.getTransactions()
          options=tableOpts
        )
        MUITable(
          title='Disclosures'
          columns=disclosureColumns
          rows=this.getDisclosures()
          options=tableOpts
        )
    `
  }
}

export default UserForm
