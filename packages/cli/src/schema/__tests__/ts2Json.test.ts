import { ts2JsonTest } from "../ts2Json";


const file = 'src/schema/__tests__/sample-interface.ts';


test('simple interface', () => {
  const result = ts2JsonTest(file, 0, 0)
  expect(ts2JsonTest(file, 0, 0)).toMatchSnapshot()
})

test('simple interface with undefined and null', () => {
  const result = ts2JsonTest(file, 0, 1)
  expect(result).toMatchSnapshot()
})

test('simple nested', () => {
  const result = ts2JsonTest(file, 0, 2)
  expect(ts2JsonTest(file, 0, 2)).toMatchSnapshot()
})

test('simple array', () => {
  expect(ts2JsonTest(file, 0, 3)).toMatchSnapshot()
})

test('complex', () => {
  const result = ts2JsonTest(file, 0, 4)
  console.log(JSON.stringify(result, null, 2))
  expect(result).toMatchSnapshot()
})
