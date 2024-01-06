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
  expect(result).toMatchSnapshot()
})

test('enum sample', () => {
  const result = ts2JsonTest(file, 0, 5)
  expect(result).toMatchSnapshot()
})
