import { client } from './api';

test('empty query interface', async () => {
  const result = await client.responses.voidResponse();
  expect(result).toBe('');
});
