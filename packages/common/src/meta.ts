const schema = require(process.cwd() + '/dist/flux-schema-new.json');
const controllerMeta = require(process.cwd() + '/dist/flux-controller.json');

export function getFluxJsonSchema() {
  if (!schema) {
    throw new Error(
      'The file flux-schema.json is missing. Please run flux start to generate it.',
    );
  }

  return schema;
}

export function getFluxControllerMeta() {
  if (!controllerMeta) {
    throw new Error(
      'The file flux-controller.json is missing. Please run flux start to generate it.',
    );
  }

  return controllerMeta;
}
