import isFunction from '../es-is/function'

let sp = (u) => {
  return (x) => {
    let url = ''

    if (isFunction(u)) {
      url = u(x)
    } else {
      url = u
    }

    if (x.storeId != null) {
      return `/store/${x.storeId}` + url
    } else {
      return url
    }
  }
}

let byId = (name) => {
  switch (name) {
    case 'coupon':
      return sp((x) => `/coupon/${x.code || x}`)
    case 'product':
      return sp((x) => `/product/${x.id || x.slug || x}`)
    case 'user':
      return sp((x) => `/user/${x.id || x.email || x}`)
    default:
      return (x) => `/${name}/${x.id || x}`
  }
}

let statusOk        = (res) => res.status === 200
let statusCreated   = (res) => res.status === 201
let statusNoContent = (res) => res.status === 204

// Complete RESTful API available with secret key, so all methods are
// exposed in server environment.
let createBlueprint = (name) => {
  let endpoint = `/${name}`

  let url = byId(name)

  return {
    list: {
      url:    endpoint,
      method: 'GET',
    },
    get: {
      url:     url,
      method:  'GET',
      expects: statusOk,
    },
    create: {
      url:     endpoint,
      method:  'POST',
      expects: statusCreated,
    },
    update: {
      url:     url,
      method:  'PATCH',
      expects: statusOk,
    },
    delete: {
      url:     url,
      method:  'DELETE',
      expects: statusNoContent,
    }
  }
}

let blueprints = {
  oauth: {
    auth: {
      method: 'POST',
      url:    '/auth',
    }
  },

  account: {
    organization: {
      method: 'GET',
      url:    '/_/account/organizations',
    }
  },

  dashv2: {
    login: {
      method: 'POST',
      url:    '/dashv2/login',
    }
  },

  counter: {
    search: {
      method: 'POST',
      url:    '/counter',
    }
  },

  library: {
    daisho: {
      method: 'GET',
      url:    '/library/daisho',
    }
  }
}

let models = [
  'order',
  'note',
  'product',
  'subscriber',
  'user',
  'wallet',
  'tokentransaction',
]

for (let k in models) {
  ((k) => {
    let model = models[k]
    blueprints[model] = createBlueprint(model)
  })(k)
}

blueprints.note.search = {
  method: 'POST',
  url:    '/search/note',
}

blueprints.user.orders = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/orders`,
  expects:  statusOk,
}

blueprints.user.transactions = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/transactions`,
  expects:  statusOk,
}

blueprints.user.tokentransactions = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/tokentransactions`,
  expects:  statusOk,
}

blueprints.user.referrals = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/referrals`,
  expects:  statusOk,
}

blueprints.user.referrers = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/referrers`,
  expects:  statusOk,
}

blueprints.user.resetPassword = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/password/reset`,
  expects:  statusOk,
}

blueprints.user.wallet = {
  method: 'GET',
  url:    (x) => `/user/${x.id || x}/wallet`,
  expects:  statusOk,
}

blueprints.transaction = {
  create: {
    url:     '/transaction',
    method:  'POST',
    expects: statusCreated,
  },
}

blueprints.library.daisho = {
  url:     '/library/daisho',
  method:  'POST',
  expects: statusOk,
}

blueprints.order.sendOrderConfirmation = {
  method: 'GET',
  url:    (x) => `/order/${x.id || x}/sendorderconfirmation`,
  expects:  statusNoContent,
}

blueprints.order.sendRefundConfirmation = {
  method: 'GET',
  url:    (x) => `/order/${x.id || x}/sendrefundconfirmation`,
  expects:  statusNoContent,
}

blueprints.order.sendFulfillmentConfirmation = {
  method: 'GET',
  url:    (x) => `/order/${x.id || x}/sendfulfillmentconfirmation`,
  expects:  statusNoContent,
}

blueprints.order.payments = {
  method: 'GET',
  url:    (x) => `/order/${x.id || x}/payments`,
  expects:  statusOk,
}

blueprints.organization = {
  get: {
    url:     (x) => `/c/organization/${x.id || x}`,
    method:  'GET',
    expects: statusOk,
  },
  update: {
    url:     (x) => `/c/organization/${x.id || x}`,
    method:  'PATCH',
    expects: statusOk,
  },
}

export default blueprints
