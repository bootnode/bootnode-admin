let toString = (obj) => {
  return Object.prototype.toString.call(obj)
}

let isFunction = (value) => {
  var str;
  if (typeof window !== 'undefined' && value === window.alert) {
    return true
  }
  str = toString(value);
  return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]'
}

export default isFunction
