import { Project, SyntaxKind, Node, Symbol, Type } from "ts-morph";

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
  } else if (type === 'Date') {
    return { type: 'string', format: 'date-time' }
  } else if (isObject(type)) {
    return { type: 'object', additionalProperties: true }
  } else if (type === 'any') {
    return {};
  };


  return { type };
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

function handleArray(type: Type) {
  const arrayType = type.getTypeArguments()[0];

  if (isPrimitive(arrayType.getText())) {
    return { type: 'array', items: primitive2Json(arrayType.getText()) }
  }

  const symbol = arrayType.getSymbol()
  if (!symbol) {
    throw new Error('Array type must have a symbol');
  }

  return { type: 'array', items: ts2Json(symbol.getDeclarations()[0], true) }
}

function handleUnion(type: Type) {
  const enums = type.getUnionTypes().filter(x => x.isStringLiteral());
  if (enums.length) {
    return { type: 'string', enum: enums.map(x => x.getText().replace(/[\'\"]/gi, '').trim()) }
  }


  const types = type.getUnionTypes().filter(x => !['false', 'undefined'].includes(x.getText()))
  const formatted = types.map(x => {
    if (isPrimitive(x.getText())) {
      return primitive2Json(x.getText());
    }

    if (x.isArray()) {
      return handleArray(x);
    }

    const symbol = x.getSymbol()
    if (symbol) {
      const node = symbol.getDeclarations()[0];
      return ts2Json(node, true);
    }


    const err = `handleDeclarations: unhandled case ${x.getText()}`
    throw new Error(err)
  })


  if (formatted.length === 2 && formatted.find((x: any) => x.type === 'null')) {
    const found = formatted.find((x: any) => x.type !== 'null');
    (found as any).nullable = true;

    return found;
  }

  if (formatted.length > 1) {
    return { anyOf: formatted }
  }

  return formatted[0];
}

export function ts2Json(node: Node, nested = false): any {
  node = unwrapPromise(node);

  const $id = nested ? undefined : node.getText();

  if (isPrimitive(node.getType().getText())) {
    return primitive2Json(node.getType().getText());
  }

  if (node.getType().isArray()) {
    return { $id, additionalProperties: false, ...handleArray(node.getType()) }
  }

  if (node.getType().isInterface() || node.getType().isObject()) {
    const required = [] as string[];
    const properties = node.getType().getProperties().
      reduce((acc: any, x) => {
        const type = x.getTypeAtLocation(node)

        if (!x.isOptional()) {
          required.push(x.getName())
        }

        if (isPrimitive(type.getText())) {
          acc[x.getName()] = primitive2Json(type.getText())
          return acc;
        }

        if (type.isArray()) {
          acc[x.getName()] = handleArray(type)
          return acc;
        }

        if (type.isUnion()) {
          acc[x.getName()] = handleUnion(type)
          return acc;
        }

        if (type.isObject() || type.isInterface()) {
          acc[x.getName()] = ts2Json(type.getSymbolOrThrow().getDeclarations()[0], true)
          return acc;
        }

        const symbol = type.getSymbol()
        if (symbol) {
          const node = symbol.getDeclarations()[0];
          return ts2Json(node, true);
        }

        throw new Error('not implemented in properties ' + type.getText() + x.getDeclarations().map(x => x.getText()))
      }, {})

    return {
      $id,
      type: 'object', additionalProperties: false, properties, required
    }
  }

  throw new Error('not implemented ' + node.getKindName())
}

export function ts2JsonTest(file: string, functionIndex = 0, paramterIndex = 0, v2 = false) {
  const project = new Project({
    compilerOptions: {
      strictNullChecks: true,
    }
  });
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
