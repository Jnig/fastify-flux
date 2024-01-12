import { ts2JsonTest } from "../ts2Json";


const file = 'src/schema/__tests__/sample-interface.ts';


test('simple interface', () => {
  const result = ts2JsonTest(file, 0, 0)
  expect(result).toMatchSnapshot()
})

test('simple interface with undefined and null', () => {
  const result = ts2JsonTest(file, 0, 1)
  expect(result).toMatchSnapshot()
})

test('simple nested', () => {
  const result = ts2JsonTest(file, 0, 2)
  expect(result).toMatchSnapshot()
})

test('simple array', () => {
  const result = ts2JsonTest(file, 0, 3)
  expect(result).toMatchSnapshot()
})

test('complex', () => {
  const result = ts2JsonTest(file, 0, 4)
  expect(result).toMatchSnapshot(result)
})

test('enum sample', () => {
  const result = ts2JsonTest(file, 0, 5)
  expect(result).toMatchSnapshot()
})

test('imported', () => {
  const result = ts2JsonTest(file, 0, 6)
  expect(result).toMatchSnapshot()
})

test('not defined', () => {
  expect.assertions(1)
  try {
    ts2JsonTest(file, 0, 7)
  } catch (err: any) {
    expect(err.message).toBe(`NotExistingInterface can't be resolved. Please check for a typo or why it is not defined.`)
  }
})
