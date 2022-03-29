import { client } from './api';

test('void response', async () => {
  const result = await client.responses.voidResponse();
  expect(result).toBe('');
});

test('string response', async () => {
  const result = await client.responses.string();
  expect(result).toBe('foo');
});

test('number response', async () => {
  const result = await client.responses.number();
  expect(result).toBe(3);
});

test('any response', async () => {
  const result = await client.responses.any();
  expect(result).toEqual({ foo: 'bar' });
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

test('undefined response', async () => {
  const result = await client.responses.undefinedResponse();
  expect(result).toEqual({
    id: 1,
    string: 'bar',
    object: {
      id: 1,
      name: 'string',
    },
    objectNull: {
      id: 1,
      name: 'string',
    },
    objectNullUndefined: null,
  });
});

test('empty interface response', async () => {
  const result = await client.responses.emptyInterfaceResponse();
  expect(result).toEqual({});
});

test('nested interface response', async () => {
  const result = await client.responses.nestedInterfaceResponse();
  expect(result).toEqual({ ids: [{ id: 0 }, { id: 1 }] });
});
