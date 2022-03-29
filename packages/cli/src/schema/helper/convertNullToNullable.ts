import _ from 'lodash';

function handleAnyOf(anyOf: { type: 'string' }[]): any {
  const hasTypeNull = anyOf.find((x: any) => x.type === 'null');
  if (!hasTypeNull || anyOf.length !== 2) {
    return;
  }

  const noneNull = anyOf.find((x: any) => x.type !== 'null');

  return { nullable: true, ...noneNull };
}

export function convertNullToNullable(object: any): any {
  return _.cloneDeepWith(object, (value) => {
    if (value['anyOf']) {
      const result = handleAnyOf(value['anyOf']);
      if (result) {
        return convertNullToNullable(result);
      }
    }

    if (value.type && _.isArray(value.type)) {
      if (value.type.includes('null')) {
        value.nullable = true;
      }
      value.anyOf = value.type
        .filter((x: string) => x !== 'null')
        .map((x: string) => {
          return { type: x };
        });
      delete value.type;
      return convertNullToNullable(value);
    }
  });
}
