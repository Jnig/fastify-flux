import { FluxRoute } from '.';

export function Controller(
  url: string,
  params: { tags: string[] },
): ClassDecorator {
  return function (constructor: Function) {
    const routes = (constructor.prototype as any).routes;
    Object.keys(routes).forEach((functionName) => {
      routes[functionName].url = url + routes[functionName].url;
      routes[functionName].tags = params.tags;
    });
  };
}

function addProperty(
  target: any,
  functionName: string | symbol,
  key: keyof FluxRoute,
  value: any,
) {
  if (!target.routes) {
    target.routes = {};
  }

  if (!target.routes[functionName]) {
    target.routes[functionName] = { statusCode: 200 };
  }

  target.routes[functionName][key] = value;
}

export function Delete(url: string = ''): MethodDecorator {
  return function (target: Object, functionName: string | symbol) {
    addProperty(target, functionName, 'url', url);
    addProperty(target, functionName, 'method', 'DELETE');
  };
}

export function Get(url: string = ''): MethodDecorator {
  return function async(target: Object, functionName: string | symbol) {
    addProperty(target, functionName, 'url', url);
    addProperty(target, functionName, 'method', 'GET');
  };
}

export function Post(url: string = ''): MethodDecorator {
  return function (target: Object, functionName: string | symbol) {
    addProperty(target, functionName, 'url', url);
    addProperty(target, functionName, 'method', 'POST');
  };
}

export function Status(code: number): MethodDecorator {
  return function (target: Object, functionName: string | symbol) {
    addProperty(target, functionName, 'statusCode', code);
  };
}

export function Auth(value: unknown): MethodDecorator {
  return function (target: Object, functionName: string | symbol) {
    addProperty(target, functionName, 'auth', value);
  };
}

export function Custom(key: string, value: unknown): MethodDecorator {
  return function (target: Object, functionName: string | symbol) {
    addProperty(target, functionName, key, value);
  };
}

export function Description(key: string, value: unknown): MethodDecorator {
  return function (target: Object, functionName: string | symbol) {
    addProperty(target, functionName, key, value);
  };
}
