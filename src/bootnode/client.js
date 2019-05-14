import Xhr from 'es-xhr-promise'
import { BOOTNODE_ENDPOINT } from '../settings'
import akasha from '../mjs-fix/akasha'

const updateParam = (url, key, value) => {
  let re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi')

  if (re.test(url)) {
    if (value != null) {
      return url.replace(re, '$1' + key + '=' + value + '$2$3')
    } else {
      let hash = url.split('#')
      url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '')
      if (hash[1] != null) {
        url += '#' + hash[1]
      }
      return url
    }
  } else {
    if (value != null) {
      let separator = url.indexOf('?') != -1 ? '&' : '?'
      let hash = url.split('#')
      url = hash[0] + separator + key + '=' + value
      if (hash[1] != null) {
        url += '#' + hash[1]
      }
      return url
    } else {
      return url
    }
  }
}

const updateQuery = (url, data) => {
  if (typeof data != 'object') {
    return url
  }

  for (let k in data) {
    let v = data[k]
    url = updateParam(url, k, v)
  }

  return url
}

export default class BootNode {
  constructor(endpoint=BOOTNODE_ENDPOINT) {
    this.endpoint = endpoint
    this.token = akasha.get('bootnode-token')
  }

  isLoggedIn() {
    return !!this.token
  }

  async login({email, password}) {
    try {
      let res = await this.request('post', 'login', {
        email: email,
        password: password
      })

      console.log('token', res.data.token)
      akasha.set('bootnode-token', res.data.token)

      return res.data.token
    } catch(e) {
      console.log('login error: ', e)
    }
  }

  logout() {
    this.token = undefined
    akasha.set('bootnode-token', '')
  }

  async request(method, route, data) {
    method = method.toUpperCase()

    let opts = {
      url: this.endpoint + route,
      method: method,
    }

    opts.headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    }

    if (method == 'GET') {
      opts.url  = updateQuery(opts.url, data)
    } else {
      opts.data = JSON.stringify(data)
    }

    try {
      let res = await (new Xhr).send(opts)

      console.log('response', res)

      res.data = res.responseText
      if (res.data.error) {
        throw new Error(res.data.error)
      }
      return res
    } catch(res) {
      try {
        res.data = res.responseText
      } catch (err) {
        console.log('response', res)
        console.log('error', err)

        throw err
      }
    }
  }
}

