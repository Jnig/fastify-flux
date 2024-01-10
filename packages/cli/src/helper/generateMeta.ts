import fg from 'fast-glob';
import { join } from 'node:path';
import pMap from 'p-map';
import { getConfig } from './config.js';
import { getControllerFunctions } from './getControllerFunctions.js';
import { Project, } from 'ts-morph';



function getProject() {
  const tsConfigFilePath = join(process.cwd(), 'tsconfig.json')
  const project = new Project({ tsConfigFilePath });
  const config = project.getCompilerOptions();
  if (!config.strict && !config.strictNullChecks) {
    throw new Error('tsconfig.json must have strict or strictNullChecks enabled.')
  }

  return project;
}

export async function generateMeta() {
  const project = getProject()
  const config = await getConfig();
  const controllers = await fg(join(config.entry, '/**/*[cC]ontroller.ts'), {
    absolute: true,
    markDirectories: true,
  });

  const results = await pMap(
    controllers,
    async (file) => {
      const definitions = await getControllerFunctions(file, project);

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
        returnSchema: x.functions[method].returnSchema,
      }),
    );
  });

  return JSON.stringify(functions, null, 2);
}
