import { ts2JsonTest } from "../ts2Json";

const foo = ts2JsonTest('src/schema/__tests__/sample-interface.ts')


test('simple interface', () => {
  const simple = foo[0].parameters[0]

  expect(simple).toMatchSnapshot()
})

test('simple interface with undefined and null', () => {
  const simpleUndefinedNull = foo[0].parameters[1]

  expect(simpleUndefinedNull).toMatchSnapshot()
})

test('simple nested', () => {
  const simpleUndefinedNull = foo[0].parameters[2]

  expect(simpleUndefinedNull).toMatchSnapshot()
})

test('simple array', () => {
  const simpleArray = foo[0].parameters[3]

  expect(simpleArray).toMatchSnapshot()
})

test('complex', () => {
  const simpleArray = foo[0].parameters[4]

  expect(simpleArray).toMatchSnapshot()
})
