const map = require('./index')
const sleep = require('sleep-promise')

describe('map', () => {
  test('map array', async () => {
    const array = [1, 2, 3, 4]

    const promise = map(array, (value, index) => Promise.resolve(value + index))
    expect(promise instanceof Promise).toBe(true)

    const results = await promise
    expect(results).toEqual([1, 3, 5, 7])
  })

  test('map promise resolves to array', async () => {
    const arrayPromise = Promise.resolve([1, 2, 3, 4])

    const promise = map(arrayPromise, (value, index) => Promise.resolve(value + index))
    expect(promise instanceof Promise).toBe(true)

    const results = await promise
    expect(results).toEqual([1, 3, 5, 7])
  })

  test('map in parallel', async () => {
    const array = [1, 2, 3, 4]

    const records = []
    const promise = map(array, async (value, index) => {
      await randomSleep()
      records.push(index)
      return value + index
    })
    expect(promise instanceof Promise).toBe(true)

    const results = await promise
    expect(results).toEqual([1, 3, 5, 7])
    expect(records).not.toEqual([0, 1, 2, 3])
  })

  test('map one by one', async () => {
    const array = [1, 2, 3, 4]

    const records = []
    const promise = map(1)(array, async (value, index) => {
      await randomSleep()
      records.push(index)
      return value + index
    })
    expect(promise instanceof Promise).toBe(true)

    const results = await promise
    expect(results).toEqual([1, 3, 5, 7])
    expect(records).toEqual([0, 1, 2, 3])
  })

  test('map step by step', async () => {
    const array = []
    for (let i = 0; i < 100; i++) array.push(i)

    const step = 10
    const records = []
    const promise = map(step)(array, async (value, index) => {
      await randomSleep()
      records.push(index)
      return 2 * value
    })
    expect(promise instanceof Promise).toBe(true)

    const results = await promise
    expect(results).toEqual(array.map(value => 2 * value))

    let i = 0
    while (i < array.length) {
      const arraySeg = array.slice(i, i + step)
      const recordsSeg = records.slice(i, i + step)

      expect(arraySeg.length).toBe(recordsSeg.length)
      expect(arraySeg).not.toEqual(recordsSeg)
      expect(arraySeg.every(value => records.includes(value))).toBe(true)
      i = i + step
    }
  })

  test('invalid usage', () => {
    expect(() => map('1')).toThrow(TypeError)
  })
})

function randomSleep () {
  return sleep(10 * Math.random())
}