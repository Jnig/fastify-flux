import { client } from './api';

test('void response', async () => {
  const result = await client.responses.voidResponse();
  expect(result).toBe('');
});

test('remove additional properties', async () => {
  const result = await client.responses.removeAdditional();
  expect(result).toEqual({
    id: 1,
    user: {
      id: 1,
      name: 'foobar',
    },
  });
});

test('handle null properties', async () => {
  const result = await client.responses.nullProperty();
  expect(result).toEqual({
    id: 1,
    user: {
      id: 1,
      name: 'foobar',
    },
    userNull: null,
  });
});

test('object response', async () => {
  const result = await client.responses.objectResponse();

  expect(result).toEqual({
    id: 1,
    anyRecord: {
      foo: 'bar',
    },
    anyObject: {
      foo: 'bar',
    },
    stringObject: {
      foo: 'bar',
    },
  });
});

test('any response', async () => {
  const result = await client.responses.anyResponse();
  expect(result).toEqual({
    id: 1,
    anyString: 'bar',
    anyArray: [1, 2, 3],
    anyObject: {
      foo: 'bar',
    },
    multiNull: null,
    multiNumber: 2,
    multiString: 'dsad',
  });
});
