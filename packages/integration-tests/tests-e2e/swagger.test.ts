import { client } from './api';

test('schema', async () => {
  const { data } = await client.instance.get('/json');
  expect(data).toMatchSnapshot();
});
