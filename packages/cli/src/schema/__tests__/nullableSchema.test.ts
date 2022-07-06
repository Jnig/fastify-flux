import { convertNullToNullable } from '../helper/convertNullToNullable';

const input = {
  UpdateTodo: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
      foo: {
        anyOf: [
          {
            type: 'null',
          },
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
      },
      user: {
        anyOf: [
          {
            type: 'null',
          },
          {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              anyOf: [
                {
                  type: 'null',
                },
                {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'number',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
};

test('convert anyOf to nullable', () => {
  expect(convertNullToNullable(input)).toMatchInlineSnapshot(`
    Object {
      "UpdateTodo": Object {
        "properties": Object {
          "foo": Object {
            "anyOf": Array [
              Object {
                "type": "null",
              },
              Object {
                "type": "string",
              },
              Object {
                "type": "number",
              },
            ],
          },
          "text": Object {
            "type": "string",
          },
          "user": Object {
            "nullable": true,
            "properties": Object {
              "nullable": true,
              "properties": Object {
                "id": Object {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "type": "object",
          },
        },
        "type": "object",
      },
    }
  `);
});

const input2 = {
  AnyResponse: {
    type: 'object',
    properties: {
      multiNull: {
        type: ['null', 'number', 'string'],
      },
      multiNull2: {
        type: ['number', 'string'],
      },
      multiNull3: {
        type: ['null', 'string'],
      },
    },
    additionalProperties: false,
    $id: 'AnyResponse',
  },
};

test('convert anyOf to nullable', () => {
  expect(convertNullToNullable(input2)).toMatchInlineSnapshot(`
    Object {
      "AnyResponse": Object {
        "$id": "AnyResponse",
        "additionalProperties": false,
        "properties": Object {
          "multiNull": Object {
            "nullable": true,
            "type": Array [
              "number",
              "string",
            ],
          },
          "multiNull2": Object {
            "type": Array [
              "number",
              "string",
            ],
          },
          "multiNull3": Object {
            "nullable": true,
            "type": "string",
          },
        },
        "type": "object",
      },
    }
  `);
});
