import Xhr from 'es-xhr-promise'
import { BOOTNODE_ENDPOINT, BOOTNODE_KEY } from '../settings'

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
  constructor(endpoint=BOOTNODE_ENDPOINT, token=BOOTNODE_KEY) {
    this.endpoint = endpoint
    this.token = token
  }

  request(method, route, data) {
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

    return (new Xhr).send(opts)
      .then((res) => {
        console.log('response', res)
        res.data = res.responseText
        if (res.data.error) {
          throw new Error(res.data.error)
        }
        return res
      }).catch((res) => {
        try {
          res.data = res.responseText
        } catch (err) {
          console.log('response', res)
          console.log('error', err)

          throw err
        }
      })
  }
}

