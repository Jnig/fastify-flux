import { client } from './api';

test('create todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  expect(result.text).toBe('foobar');
  expect(result.priority).toBe(1);
});

test('list todo', async () => {
  const result = await client.todos.list();
  expect(result.length).toBeGreaterThanOrEqual(1);
});

test('get todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  const retrieved = await client.todos.get(result.id);
  expect(result.id).toBe(retrieved.id);
});

test('update todo', async () => {
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.update(result.id, { done: true });

  const updated = await client.todos.get(result.id);
  expect(updated.done).toBeTruthy();
});

test('remove todo', async () => {
  expect.assertions(1);
  const result = await client.todos.create({ text: 'foobar', priority: 1 });
  await client.todos.remove(result.id);

  try {
    await client.todos.get(result.id);
  } catch (err: any) {
    expect(err.data.statusCode).toBe(404);
  }
});
