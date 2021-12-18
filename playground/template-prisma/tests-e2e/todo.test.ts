import { client } from './api';

test('list todo', async () => {
  await client.todos.list();
});

test('create todo', async () => {
  await client.todos.create({ text: 'foobar', priority: 1 });
});

test('get todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.get(result.id);
});

test('remove todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.remove(result.id);
});
