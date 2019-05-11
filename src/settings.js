export const PRODUCTION   = typeof window === 'undefined' ? true : window.location.href.indexOf('bootnode') >= 0

export let BOOTNODE_ENDPOINT = PRODUCTION ? 'https://bootnode-api.hanzo.ai/' : 'http://192.168.1.20:4000/'
export let BOOTNODE_KEY = 'fLcLu7OLD81aR9jf'
