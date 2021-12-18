import { Project, SyntaxKind } from 'ts-morph';

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

export function getControllerFunctions(file: string) {
  const project = new Project();
  project.addSourceFileAtPath(file);
  const parsed = project.getSourceFile(file);
  if (!parsed) {
    throw new Error(`${file} could not be parsed`);
  }

  const classes = parsed.getDescendantsOfKind(SyntaxKind.ClassDeclaration);
  if (!classes.length) {
    throw new Error('Controller must contain a class declaration');
  }

  if (classes.length > 1) {
    throw new Error('Controller must contain only one class declaration');
  }

  const className = classes[0].getName();

  const declarations = classes[0].getInstanceMethods();

  const mapped = declarations.reduce<any>((acc, y) => {
    const params = y.getParameters().map((x) => {
      return {
        name: x.getNameNode().getText(),
        type: cleanInterfaceName(x.getTypeNode()?.getText()),
      };
    });

    const name = y.getNameNode().getText();
    const returnType = cleanInterfaceName(y.getReturnTypeNode()?.getText());

    acc[name] = {
      params,
      returnType,
    };

    return acc;
  }, {});

  return { className, file, functions: mapped };
}
