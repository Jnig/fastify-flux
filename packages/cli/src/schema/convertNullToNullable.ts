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
  });
}
