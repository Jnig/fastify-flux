import { ts2JsonTest } from "../ts2Json";


const file = 'src/schema/__tests__/sample-interface.ts';


test('simple interface', () => {
  const result = ts2JsonTest(file, 0, 0, true)
  expect(result).toMatchSnapshot()
})

test('simple interface with undefined and null', () => {
  const result = ts2JsonTest(file, 0, 1, true)
  expect(result).toMatchSnapshot()
})

test('simple nested', () => {
  const result = ts2JsonTest(file, 0, 2, true)
  expect(result).toMatchSnapshot()
})

test('simple array', () => {
  const result = ts2JsonTest(file, 0, 3, true)
  expect(result).toMatchSnapshot()
})

test('complex', () => {
  const result = ts2JsonTest(file, 0, 4, true)
  expect(result).toMatchSnapshot(result)
})

test('enum sample', () => {
  const result = ts2JsonTest(file, 0, 5, true)
  expect(result).toMatchSnapshot()
})
