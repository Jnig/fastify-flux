import { Project, SyntaxKind, } from 'ts-morph';
import { log } from '../log.js';
import { ts2Json } from '../schema/ts2Json.js';
import { join } from 'node:path';

export function cleanInterfaceName(name: string | undefined) {
  if (!name) {
    return '';
  }

  return name
    .replace('Promise<', '')
    .replace('>', '')
    .replace('void', '')
    .replace('[]', '')
    .split('.')
    .slice(-1)[0];
}

export async function getControllerFunctions(file: string, project: Project) {
  project.addSourceFileAtPath(file);
  const parsed = project.getSourceFile(file);
  if (!parsed) {
    log({
      component: 'cli',
      error: 'File could not be parsed',
      details: `${file}`,
    });
    throw new Error();
  }

  const classes = parsed.getDescendantsOfKind(SyntaxKind.ClassDeclaration);
  if (!classes.length) {
    log({
      component: 'cli',
      error: 'Controller file does not contain a class declaration',
      details: `${file}`,
    });
    throw new Error();
  }

  if (classes.length > 1) {
    log({
      component: 'cli',
      error: 'Controller must contain only one class declaration',
      details: `${file}`,
    });
    throw new Error();
  }

  const className = classes[0].getName();

  const declarations = classes[0].getInstanceMethods();

  const mapped = declarations.reduce<any>((acc, y) => {
    const params = y.getParameters().map((x) => {


      return {
        name: x.getNameNode().getText(),
        type: cleanInterfaceName(x.getTypeNode()?.getText()),
        schema: ['query', 'body'].includes(x.getNameNode().getText()) ? ts2Json(x.getTypeNodeOrThrow()) : undefined,
      };
    });


    const name = y.getNameNode().getText();
    const returnType = cleanInterfaceName(y.getReturnTypeNode()?.getText());
    const returnSchema = ts2Json(y.getReturnTypeNodeOrThrow());

    acc[name] = {
      params,
      returnType,
      returnSchema
    };

    return acc;
  }, {});

  return { className, file, functions: mapped };
}
