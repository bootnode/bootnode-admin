import akasha from './mjs-fix/akasha'

export let setUser = (user) => {
  return akasha.set('account.user', user)
}

export let setOrgs = (orgs) => {
  return akasha.set('account.orgs', orgs)
}

export let setActiveOrg = (org) => {
  return akasha.set('account.activeOrg', activeOrg)
}

export let getUser = (user) => {
  return akasha.get('account.user')
}

export let getOrgs = (orgs) => {
  return akasha.get('account.orgs')
}

export let getOrg = () => {
  let orgs = getOrgs()

  if (!orgs) {
    return undefined
  }

  return orgs[akasha.get('account.activeOrg')]
}

export let getActiveOrg = () => {
  return akasha.get('account.activeOrg')
}

export let getAccount = () => {
  return {
    user: akasha.get('account.user'),
    orgs: akasha.get('account.orgs'),
    activeOrg: akasha.get('account.activeOrg'),
    org: getOrg(),
  }
}

export let login = ({user, orgs, activeOrg}) => {
  akasha.set('account.user', user)
  akasha.set('account.orgs', orgs)
  akasha.set('account.activeOrg', activeOrg)
}

export let logout = () => {
  akasha.clear('account.user')
  akasha.clear('account.orgs')
  akasha.clear('account.activeOrg')
}

export let isLoggedIn = () => {
  let { user, orgs, activeOrg } = getAccount()

  return user && orgs && activeOrg != null && getOrg()
}
