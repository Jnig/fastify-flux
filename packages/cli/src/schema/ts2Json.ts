import { Project, SyntaxKind, Node, Symbol } from "ts-morph";

const primitives = ['void', 'number', 'string', 'any', 'boolean', 'Date', 'null',]

function primitive2Json(primitive: string) {
  return { type: primitive, }
}

function unionToJson(union: string) {
  console.log(union);
  const splitted = union.split(' | ')

  const formatted = splitted.filter(x => x !== 'undefined').map((x: string) => {
    if (x === 'Date') {
      return { type: 'string', format: 'date-time' }
    }

    if (x === 'any') {
      return {};
    }

    return { type: x };
  })

  if (formatted.length > 1) {
    return { anyOf: formatted }
  }

  return formatted[0];
}


function handleDeclarations(symbol: Symbol, parent: Node) {

  const type = symbol.getTypeAtLocation(parent);
  const propertySignature = symbol.getDeclarations()[0]

  if (!propertySignature) {
    return unionToJson(type.getText())

  }

  const skipKinds = [SyntaxKind.Identifier, SyntaxKind.UnionType, SyntaxKind.QuestionToken]
  const nestedInterfaces = propertySignature.forEachDescendantAsArray()
    .filter(x => !skipKinds.includes(x.getKind()))
    .filter((x) => {
      return !primitives.includes(x.getText())
    })
  console.log(nestedInterfaces.map(x => x.getKindName()))

  if (nestedInterfaces.length > 0) {
    return ts2Json(nestedInterfaces[0], true)
  }


  return unionToJson(type.getText())
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

export function ts2Json(returnType: Node, nested = false): string | Array<Record<string, any>> | Record<string, any> {
  returnType = unwrapPromise(returnType);

  let insidePromise: undefined | string;
  insidePromise = returnType.getText() || '';

  if (primitives.includes(insidePromise)) {
    return { ...primitive2Json(insidePromise) };
  }

  if (nested) {
    insidePromise = undefined;
  }

  let isArray = false;
  if (returnType.getKind() === SyntaxKind.ArrayType) {
    isArray = true;
    returnType = unwrapArray(returnType)
  }

  const required = [] as string[];
  const properties = returnType.getType().getProperties().reduce((acc: any, x) => {
    acc[x.getName()] = handleDeclarations(x, returnType)
    if (!x.isOptional()) {
      required.push(x.getName())
    }

    return acc
  }, {})

  if (nested && !properties.length) {
    //    return { type: 'object', additionalProperties: true };
  }


  const jsonObject = { type: 'object', properties, required, additionalProperties: false, '$id': insidePromise };
  if (isArray) {
    jsonObject['$id'] = undefined;
    return { type: 'array', items: jsonObject, additionalProperties: false, '$id': insidePromise }
  } else {
    return jsonObject;
  }

}


export function ts2JsonTest(file: string, functionIndex = 0, paramterIndex = 0) {
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

  return ts2Json(methods[functionIndex].getParameters()[paramterIndex].getTypeNodeOrThrow());
}
