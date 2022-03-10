import { convertEmptyObject } from '../helper/convertEmptyObject';

const input = {
  UpdateTodo: {
    type: 'object',
    properties: {
      anyObject: {
        type: 'object',
      },
    },
  },
};

test('convert anyOf to nullable', () => {
  expect(convertEmptyObject(input)).toMatchInlineSnapshot(`
Object {
  "UpdateTodo": Object {
    "properties": Object {
      "anyObject": Object {
        "additionalProperties": true,
        "type": "object",
      },
    },
    "type": "object",
  },
}
`);
});
