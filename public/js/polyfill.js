if (typeof Object.values !== 'function') {
  Object.values = function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key]
    })
  }
}
