import { client } from './api';

test('list todo', async () => {
  await client.todos.list();
});

test('create todo', async () => {
  await client.todos.create({ text: 'foobar', priority: 1 });
});

test('update todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.get(result.id);
  await client.todos.update(result.id, { text: 'barfoo', priority: 2 });
});

test('get todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.get(result.id);
});

test('remove todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.remove(result.id);
});
