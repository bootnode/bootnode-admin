import akasha from './mjs-fix/akasha'
import { renderDate, rfc3339 } from './util/date'

let lastChecked, countries

export let loadLibrary = (client) => {
  // fetch library data
  lastChecked   = akasha.get('library.lastChecked')
  countries     = akasha.get('library.countries') || []

  lastChecked = renderDate(new Date(), rfc3339)

  return client.library.daisho({
    hasCountries:       !!countries && countries.length != 0,
    lastChecked:        renderDate(lastChecked || '2000-01-01', rfc3339),
  }).then((res) => {
    countries = res.countries || countries

    akasha.set('library.lastChecked', lastChecked)
    akasha.set('library.countries', countries)
  })
}

export let getLibrary = () => {
  return {
    lastChecked: lastChecked || akasha.get('library.lastChecked'),
    countries:   countries   || akasha.get('library.countries') || [],
  }
}
