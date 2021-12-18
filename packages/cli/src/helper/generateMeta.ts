import fg from 'fast-glob';
import pMap from 'p-map';
import { getControllerFunctions } from './getControllerFunctions.js';

export async function generateMeta() {
  const controllers = await fg('./src/**/*.controller.ts', {
    absolute: true,
    markDirectories: true,
  });

  const results = await pMap(
    controllers,
    async (file) => {
      const definitions = await getControllerFunctions(file);

      return definitions;
    },
    { concurrency: 2 },
  );

  const functions = [] as any;
  results.forEach((x) => {
    Object.keys(x.functions).forEach((method) =>
      functions.push({
        className: x.className,
        functionName: method,
        params: x.functions[method].params,
        returnType: x.functions[method].returnType,
      }),
    );
  });

  return JSON.stringify(functions, null, 2);
}
