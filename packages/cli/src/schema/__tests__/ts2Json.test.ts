import { ts2Json } from "../ts2Json";

const foo = ts2Json('src/schema/__tests__/sample-interface.ts')


test('foo', () => {
  console.log('test did run')
})
