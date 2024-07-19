import { FastifyReply, FastifyRequest } from 'fastify';
import { FluxConfig, FluxRoute, FluxRoutes } from '..';
import { getRouteMappers } from '../helper/call-parameter';
import { getFluxControllerMeta } from '../meta';

const controllerMeta = getFluxControllerMeta();

export function getSchemaParams(route: FluxRoute) {
  const matches = route.url.match(/:[a-zA-Z]+/g);

  if (!matches || !matches.length) {
    return;
  }

  const params = {
    type: 'object',
    properties: {} as { [key: string]: { type: string } },
  };

  matches.forEach((element: string) => {
    const nameShort = element.replace(':', '');
    const found = route.params.find((x) => x.name === nameShort);
    if (found) {
      params.properties[nameShort] = { type: found.type };
    }
  });

  return params;
}

function getSchemaQuerystring(route: FluxRoute) {
  const query = route.params.filter((x) => x.name === 'query');
  if (query.length > 1) {
    throw new Error(`too many potential query params for ${route.url}`);
  }

  if (!query.length) {
    return;
  }

  return query[0].schema;
}

export function getSchemaBody(route: FluxRoute) {
  const body = route.params.filter((x) => x.name === 'body');

  if (body.length > 1) {
    throw new Error(`too many potential body params for ${route.url}`);
  }

  if (!body.length) {
    return;
  }

  return body[0].schema;
}

function addSchema(config: FluxConfig, schema: any) {
  if (config.fastify.getSchema(schema['$id'])) {
    return;
  }

  if (schema.type === 'array') {
    config.fastify.addSchema({ $id: schema['$id'], ...schema.items });
  } else {
    config.fastify.addSchema(schema);
  }
}

export function getSchemaResponse(config: FluxConfig, route: FluxRoute) {
  const name = route.returnType;

  if (name === 'any') {
    return {};
  }

  if (name === 'string') {
    return {
      [route.statusCode]: {
        type: 'string',
      },
    };
  }

  if (name === 'number') {
    return {
      [route.statusCode]: {
        type: 'number',
      },
    };
  }

  if (name) {
    addSchema(config, route.returnSchema);
    return {
      [route.statusCode]: route.returnSchema,
    };
  }

  return {
    [route.statusCode]: {},
  };
}

function handleRoute(config: FluxConfig, route: FluxRoute, f: Function) {
  const { url, method, tags, statusCode } = route;

  const routeMappers = getRouteMappers(config, route);

  const s = {
    operationId: f.name,
    tags,
    params: getSchemaParams(route),
    querystring: getSchemaQuerystring(route),
    body: getSchemaBody(route),
    response: getSchemaResponse(config, route),
    description: route.description,
    summary: route.summary,
  } as any;

  // remove undefined value with stringify and parse
  Object.keys(s).forEach((key) => {
    if (s[key] === undefined) {
      delete s[key];
    }
  });

  config.fastify.route({
    method,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await f(...routeMappers.map((x) => x({ request, reply })));

      if (!reply.sent) {
        reply.code(statusCode).send(result);
      }
    },
    url,
    schema: s,
    config: route,
  });
}

export function registerController(
  controller: { new (): any },
  options: FluxConfig,
) {
  if (!controller.name.endsWith('Controller')) {
    throw new Error(
      `${controller.name} is invalid. Name must end with Controller.`,
    );
  }

  const routes: FluxRoutes = (controller.prototype as any).routes;

  const instance = new controller();

  Object.keys(routes).forEach((functionName: string) => {
    const found = controllerMeta.find(
      (x: any) =>
        x.className === controller.name && x.functionName === functionName,
    );
    if (!found) {
      throw new Error(
        `No definition found for controller ${controller.name} and function ${functionName}`,
      );
    }
    const meta = { ...routes[functionName], ...found };
    handleRoute(options, meta, (instance as any)[functionName]);
  });
}
