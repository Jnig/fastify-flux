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

    if (value.type && _.isArray(value.type) && value.type.includes('null')) {
      if (value.type.includes('null')) {
        value.nullable = true;
      }
      const notNullTypes = value.type.filter((x: string) => x !== 'null');
      if (notNullTypes.length === 1) {
        value.type = notNullTypes[0];
      } else {
        value.type = notNullTypes;
      }

      return convertNullToNullable(value);
    }
  });
}
