const controllerMeta = require(process.cwd() + '/dist/flux-controller.json');

export function getFluxControllerMeta() {
  if (!controllerMeta) {
    throw new Error(
      'The file flux-controller.json is missing. Please run flux start to generate it.',
    );
  }

  return controllerMeta;
}
