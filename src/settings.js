export const PRODUCTION   = typeof window === 'undefined' ? true : window.location.href.indexOf('bootnode') >= 0

export let BOOTNODE_ENDPOINT = PRODUCTION ? 'https://bootnode-api.hanzo.ai/' : 'http://localhost:4000/'
