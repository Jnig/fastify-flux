import { FluxConfig, FluxRoute, FluxMapping } from '..';

const defaultMapping: FluxMapping[] = [
  {
    name: 'query',
    mapper({ request }) {
      return request.query;
    },
  },
  {
    name: 'body',
    mapper({ request }) {
      return request.body;
    },
  },
  {
    type: 'FastifyReply',
    mapper({ reply }) {
      return reply;
    },
  },
  {
    type: 'FastifyRequest',
    mapper({ request }) {
      return request;
    },
  },
];

function getParamMapper(name: string): FluxMapping['mapper'] {
  return ({ request }) => {
    const { params } = request as any;

    if (params && params.hasOwnProperty(name)) {
      return params[name];
    }

    throw new Error(
      `Couldn't find url parameter ${name} for url ${request.url}.`,
    );
  };
}

export function getRouteMapper(
  config: FluxConfig,
  param: FluxRoute['params'][number],
) {
  const mapping = [...defaultMapping, ...(config.mapping || [])];

  if (param.type) {
    const typeFound = mapping.find((x) => x.type === param.type);
    if (typeFound) {
      return typeFound.mapper;
    }
  }

  if (param.name) {
    const nameFound = mapping.find((x) => x.name === param.name);
    if (nameFound) {
      return nameFound.mapper;
    }
  }

  return getParamMapper(param.name);
}

export function getRouteMappers(config: FluxConfig, route: FluxRoute) {
  return route.params.map((x) => getRouteMapper(config, x));
}
