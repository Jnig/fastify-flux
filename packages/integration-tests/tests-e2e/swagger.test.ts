import { client2, client } from './api';

test('schema', async () => {
  const { data } = await client.instance.get('/json');
  expect(data).toMatchSnapshot();
});

test('schema', async () => {
  const { data } = await client2.instance.get('/json');
  expect(data).toMatchSnapshot();
});
