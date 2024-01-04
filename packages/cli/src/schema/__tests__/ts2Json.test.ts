import { ts2JsonTest } from "../ts2Json";


const file = 'src/schema/__tests__/sample-interface.ts';


test('simple interface', () => {
  expect(ts2JsonTest(file, 0, 0)).toMatchSnapshot()
})

test('simple interface with undefined and null', () => {
  expect(ts2JsonTest(file, 0, 1)).toMatchSnapshot()
})

test('simple nested', () => {
  expect(ts2JsonTest(file, 0, 2)).toMatchSnapshot()
})

test('simple array', () => {

  expect(ts2JsonTest(file, 0, 3)).toMatchSnapshot()
})

test.only('complex', () => {
  console.log(ts2JsonTest(file, 0, 4))
  expect(ts2JsonTest(file, 0, 4)).toMatchSnapshot()
})
