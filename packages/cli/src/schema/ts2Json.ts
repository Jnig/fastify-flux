import { Project, SyntaxKind, Node, Symbol } from "ts-morph";

const primitives = ['^void$',
  '^number$',
  '^string$',
  '^any$',
  '^boolean$',
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
  const propertySignature = symbol.getDeclarations()[0]
  if (!propertySignature) { // why needed for prisma ?
    return primitive2Json(type.getText())
  }

  const skipKinds = [
    SyntaxKind.Identifier,
    SyntaxKind.QuestionToken,
    SyntaxKind.ColonToken,
    SyntaxKind.BarToken,
    SyntaxKind.SemicolonToken,
  ];

  const unions = propertySignature.getChildrenOfKind(SyntaxKind.UnionType)

  const formatted = [];
  if (unions.length) {
    const foo = unions[0].getChildren()[0].getChildren().filter(x => !skipKinds.includes(x.getKind())).map(x => {
      if (isPrimitive(x.getText())) {
        return primitive2Json(x.getText())
      } else {
        return ts2Json(x, true)
      }
    })

    formatted.push(...foo)
  } else {
    const foo = propertySignature.getChildren().filter(x => !skipKinds.includes(x.getKind())).map(x => {
      if (isPrimitive(x.getText())) {
        return primitive2Json(x.getText())
      } else {
        return ts2Json(x, true)
      }
    })

    formatted.push(...foo)
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
  return node.getChildAtIndex(0);
}

export function ts2Json(returnType: Node, nested = false): string | Array<Record<string, any>> | Record<string, any> {
  returnType = unwrapPromise(returnType);



  let isArray = false;
  if (returnType.getKind() === SyntaxKind.ArrayType) {
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
