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
    {
      "UpdateTodo": {
        "properties": {
          "anyObject": {
            "additionalProperties": true,
            "type": "object",
          },
        },
        "type": "object",
      },
    }
  `);
});
