import _ from 'lodash';

export function convertEmptyObject(object: any): any {
  return _.cloneDeepWith(object, (value) => {
    if (_.isEqual(value, { type: 'object' })) {
      return { ...value, additionalProperties: true };
    }
  });
}
