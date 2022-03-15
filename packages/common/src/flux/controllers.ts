import { FastifyReply, FastifyRequest } from 'fastify';
import { FluxConfig, FluxRoute, FluxRoutes } from '..';
import { getRouteMappers } from '../helper/call-parameter';
import {
  getSchemaBody,
  getSchemaParams,
  getSchemaQuerystring,
  getSchemaResponse,
} from '../helper/schema';
import { getFluxControllerMeta, getFluxJsonSchema } from '../meta';

const controllerMeta = getFluxControllerMeta();
const schema = getFluxJsonSchema();

function handleRoute(config: FluxConfig, route: FluxRoute, f: Function) {
  const { url, method, tags, statusCode } = route;

  const routeMappers = getRouteMappers(config, route);

  config.fastify.route({
    method,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await f(...routeMappers.map((x) => x({ request, reply })));

      if (!reply.sent) {
        reply.code(statusCode).send(result);
      }
    },
    url,
    schema: {
      operationId: f.name,
      tags,
      params: getSchemaParams(route),
      querystring: getSchemaQuerystring(config, route, schema),
      body: getSchemaBody(config, route, schema),
      response: getSchemaResponse(config, route, schema),
    } as any,
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
