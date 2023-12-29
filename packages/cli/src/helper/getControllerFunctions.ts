import { MethodDeclaration, ParameterDeclaration, Project, ReturnTypedNode, SyntaxKind, SyntaxList, TypeNode, TypeReferenceNode } from 'ts-morph';
import { log } from '../log.js';
import { getTypeOfReturn } from '../schema/ts2Json.js';

export function cleanInterfaceName(name: string | undefined) {
  if (!name) {
    return '';
  }

  return name
    .replace('Promise<', '')
    .replace('>', '')
    .replace('void', '')
    .split('.')
    .slice(-1)[0];
}




function getTypeOfInterface(parameter: ParameterDeclaration) {
  const declaration = parameter.getParent()

  const type = parameter.getType()
  const name = parameter.getType().getText();
  const primitives = ['string', 'number', 'boolean', 'Date'];

  if (primitives.includes(name)) {
    return [];
  }

  return type.getProperties().map((prop) => {
    return {
      name: prop.getName(),
      type: prop.getTypeAtLocation(declaration).getText(),
    }
  })
}



export function getControllerFunctions(file: string) {
  const project = new Project({ compilerOptions: { strictNullChecks: true } });
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

      const resolved = getTypeOfInterface(x);

      return {
        name: x.getNameNode().getText(),
        type: cleanInterfaceName(x.getTypeNode()?.getText()),
        resolved,
      };
    });


    const name = y.getNameNode().getText();
    const returnType = cleanInterfaceName(y.getReturnTypeNode()?.getText());
    const returnTypeResolved = getTypeOfReturn(y.getReturnTypeNodeOrThrow());
    console.log(file, JSON.stringify(returnTypeResolved, null, 2))

    acc[name] = {
      params,
      returnType,
    };

    return acc;
  }, {});

  return { className, file, functions: mapped };
}
