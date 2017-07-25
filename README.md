# JS Async Map

Map array with async functions.

## Features

- map array with async function
- map promise which resolves to array
- map in parallel
- map in serial with customized step

## Installation

```
npm i -S async-map
```

## Usage

#### map array with async func

```ecmascript 6
const results = await map([1,2,3], async (value, index) => await someAsyncFunc(value, index))
```

#### map promise which resolves to array

```ecmascript 6
const results = await map(Promise.resolve([1,2,3]), async (value, index) => await someAsyncFunc(value, index))
```

#### map one by one

In the above examples, promise are resolved in parallel.
However, you can easily map them one by one.

```ecmascript 6
// map(1) returns another map function which maps values one by one 
const results = await map(1)([1,2,3], async (value, index) => await someAsyncFunc(value, index))
```

#### map step by step

As you guess, `map` can receive not only 1 as the step param.
You can give any positive number as step, so within the step, values are
resolved in parallel, but steps are resolved one by one.

```ecmascript 6
// map(step) returns another map function which maps value step by step in serial but in parallel within the each step
const results = await map(7)(_.range(100), async (value, index) => await someAsyncFunc(value, index))
```

## License

MIT