// from
// https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
let capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default capitalize
