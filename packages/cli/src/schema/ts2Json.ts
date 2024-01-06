import { Project, SyntaxKind, Node, Symbol } from "ts-morph";

const primitives = ['^void$',
  '^number$',
  '^string$',
  '^any$',
  '^boolean$',
  '^true$',
  '^Date$',
  '^null$',
]

function isObject(str: string) {
  const objects = [
    '^Record<.+,.+>$', // Record<any,any>
    '^{\\s?\\[.+:\\s?.+\\]\\s?:.+}$', // { [key: any]: any}
  ];

  return objects.some(x => new RegExp(x).test(str));
}

function isPrimitive(str: string) {
  return isObject(str) || primitives.some(x => new RegExp(x).test(str));
}



function primitive2Json(type: string) {
  if (type === 'true') { // getUntionTypes returns [true, false]
    return { type: 'boolean' }
  }

  if (type === 'Date') {
    return { type: 'string', format: 'date-time' }
  }

  if (isObject(type)) {
    return { type: 'object', additionalProperties: true }
  }

  if (type === 'any') {
    return {};
  }

  return { type };

}


function handleDeclarations(symbol: Symbol, parent: Node) {
  const type = symbol.getTypeAtLocation(parent);

  const formatted = [];

  const enums = symbol.getDeclarations()[0].getDescendantsOfKind(SyntaxKind.StringLiteral);


  if (enums.length) {
    return { type: 'string', enum: enums.map(x => x.getText().replace(/[\'\"]/gi, '')) }
  } else if (type.isUnion()) {
    const types = type.getUnionTypes().filter(x => !['false', 'undefined'].includes(x.getText()))
    formatted.push(...types.map(x => {
      if (isPrimitive(x.getText())) {
        return primitive2Json(x.getText());
      }

      const symbol = x.getSymbol()
      if (symbol) {
        const node = symbol.getDeclarations()[0];
        return ts2Json(node, true);
      }

      throw new Error('unhandled case')

    }))
  } else {
    if (isPrimitive(type.getText())) {
      return primitive2Json(type.getText())
    }

    const parent = symbol.getDeclarations()[0];
    return ts2Json(parent, true);
  }

  if (formatted.length === 2 && formatted.find((x: any) => x.type === 'null')) {
    const found = formatted.find((x: any) => x.type !== 'null');
    (found as any).nullable = true;

    return found;

  }

  if (formatted.length > 1) {
    return { anyOf: formatted }
  } else {
    return formatted[0];
  }
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
  if (node.getKind() === SyntaxKind.ArrayType) {
    return node.getChildAtIndex(0);
  }

  return node.getChildrenOfKind(SyntaxKind.ArrayType)[0].getChildren()[0]
}

export function ts2Json(returnType: Node, nested = false): string | Array<Record<string, any>> | Record<string, any> {
  returnType = unwrapPromise(returnType);

  let isArray = false;
  if (returnType.getKind() === SyntaxKind.ArrayType || returnType.getChildrenOfKind(SyntaxKind.ArrayType).length) {
    isArray = true;
    returnType = unwrapArray(returnType)
  }

  if (isPrimitive(returnType.getText())) {
    if (isArray) {
      return { type: 'array', items: primitive2Json(returnType.getText()) }
    } else {
      return { ...primitive2Json(returnType.getText()) };
    }
  }

  const required = [] as string[];
  const properties = returnType.getType().getProperties().reduce((acc: any, x) => {
    acc[x.getName()] = handleDeclarations(x, returnType)
    if (!x.isOptional()) {
      required.push(x.getName())
    }

    return acc
  }, {})

  let name = returnType.getText() || '' as string | undefined
  if (nested) {
    name = undefined;
  }

  const jsonObject = { type: 'object', properties, required, additionalProperties: false, '$id': name };
  if (isArray) {
    jsonObject['$id'] = undefined;
    return { type: 'array', items: jsonObject, additionalProperties: false, '$id': name }
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
