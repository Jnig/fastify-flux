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
    {
      "UpdateTodo": {
        "properties": {
          "foo": {
            "anyOf": [
              {
                "type": "null",
              },
              {
                "type": "string",
              },
              {
                "type": "number",
              },
            ],
          },
          "text": {
            "type": "string",
          },
          "user": {
            "nullable": true,
            "properties": {
              "nullable": true,
              "properties": {
                "id": {
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
    {
      "AnyResponse": {
        "$id": "AnyResponse",
        "additionalProperties": false,
        "properties": {
          "multiNull": {
            "nullable": true,
            "type": [
              "number",
              "string",
            ],
          },
          "multiNull2": {
            "type": [
              "number",
              "string",
            ],
          },
          "multiNull3": {
            "nullable": true,
            "type": "string",
          },
        },
        "type": "object",
      },
    }
  `);
});
