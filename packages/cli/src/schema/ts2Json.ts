import { Project, SyntaxKind, TypeNode, Node, Symbol } from "ts-morph";

const primitives = ['void', 'number', 'string', 'any', 'boolean', 'Date', 'null']
function handleDeclarations(symbol: Symbol, parent: Node) {

  const type = symbol.getTypeAtLocation(parent);
  const propertySignature = symbol.getDeclarations()[0]
  if (!propertySignature) {
    return { type: type.getText(), childs: '' }

  }

  const skipKinds = [SyntaxKind.Identifier, SyntaxKind.UnionType, SyntaxKind.QuestionToken]
  const nestedInterfaces = propertySignature.forEachDescendantAsArray()
    .filter(x => !skipKinds.includes(x.getKind()))
    .filter((x) => {
      return !primitives.includes(x.getText())
    })

  if (nestedInterfaces.length > 0) {
    return getTypeOfReturn(nestedInterfaces[0])
  }


  return { type: type.getText() }


}


function unwrapPromise(node: Node): Node {
  const identifier = node.getFirstChildByKind(SyntaxKind.Identifier)
  if (!identifier) {
    return node;
  }


  if (identifier.getText() === 'Promise') {
    const found = node.forEachChildAsArray().find(x => x.getText() !== 'Promise')
    if (!found) {
      throw new Error('unwrapPromise: did not find type inside Promise');
    }

    return found;
  }

  return node;
}

function unwrapArray(node: Node) {
  return node.getChildAtIndex(0);
}

export function getTypeOfReturn(returnType: Node): string | Array<Record<string, any>> | Record<string, any> {
  returnType = unwrapPromise(returnType);

  const insidePromise = returnType.getText() || '';
  if (primitives.includes(insidePromise)) {
    return insidePromise;
  }

  let isArray = false;
  if (returnType.getKind() === SyntaxKind.ArrayType) {
    isArray = true;
    returnType = unwrapArray(returnType)
  }


  const properties = returnType.getType().getProperties().reduce((acc: any, x) => {
    acc[x.getName()] = handleDeclarations(x, returnType)

    return acc
  }, {})


  if (isArray) {
    return { type: 'array', properties }
  } else {
    return { type: 'object', properties };
  }

}


export function ts2Json(file: string) {
  const project = new Project({ compilerOptions: { strictNullChecks: true } });
  project.addSourceFileAtPath(file);
  const parsed = project.getSourceFile(file);
  if (!parsed) {
    throw new Error('parsing did not work');
  }

  const classes = parsed.getDescendantsOfKind(SyntaxKind.ClassDeclaration);
  if (!classes) {
    throw new Error('did not found a class');
  }


  const methods = classes[0].getInstanceMethods();

  [methods[0]].forEach((method) => {
    const foo = getTypeOfReturn(method.getReturnTypeNodeOrThrow())
    console.log(JSON.stringify(foo, null, 2))
  });

}
