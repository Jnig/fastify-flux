import { client2 } from './api';

test('schema', async () => {
  const { data } = await client2.instance.get('/json');
  expect(data).toMatchSnapshot();
});
