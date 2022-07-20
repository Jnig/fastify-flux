import { client } from './api';

test('empty query interface', async () => {
  const result = await client.responses.voidResponse();
  expect(result).toBe('');
});

test('input empty string is casted to null', async () => {
  const result = await client.inputs.emptyStringNull({ n: '' as any, n2: '' as any });
  expect(result).toEqual({ n: null, n2: null });
});
