// the exported function could be treated as map or mapStepByStep
/**
 * mapStepByStep
 * @param step
 * @returns map
 */
/**
 * map
 * @param {Array | Promise<Array>} array
 * @param {Function} mapper - async func(item, index) => result
 * @returns {Promise<Array>} results
 */
module.exports = function map (array, mapper) {
  if (mapper === undefined) {
    const step = array
    if (step === 1) return _mapOneByOne
    else if (step > 1) return _mapStepByStep(step)
    else throw new TypeError('step must be a positive number')
  }
  else {
    return _mapAll(array, mapper)
  }
}

function _mapAll (array, mapper) {
  return Promise.resolve(array).then(array => Promise.all(array.map(mapper)))
}

function _mapOneByOne (array, mapper) {
  return Promise.resolve(array).then(async array => {
    const results = []
    for (let i = 0; i < array.length; i++) {
      results.push(await mapper(array[i], i))
    }
    return results
  })
}

function _mapStepByStep (step) {
  return function (array, mapper) {
    return Promise.resolve(array).then(async array => {
      let i = 0
      const results = []
      while (i < array.length) {
        results.push(...await Promise.all(array.slice(i, i + step).map((value, index) => mapper(value, i + index))))
        i = i + step
      }
      return results
    })
  }
}
