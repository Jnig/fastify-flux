import { FluxConfig, FluxRoute } from '../types';

interface schemas {
  [k: string]: any;
}

function getSchemaOrThrow(config: FluxConfig, name: string, s: schemas) {
  if (!s[name]) {
    throw new Error(`Schema ${name} not found.`);
  }

  const schema = s[name] as { $id: string };
  if (!config.fastify.getSchema(schema['$id'])) {
    config.fastify.addSchema(schema);
  }

  return schema;
}

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

export function getSchemaQuerystring(
  config: FluxConfig,
  route: FluxRoute,
  s: schemas,
) {
  const query = route.params.filter((x) => x.name === 'query');

  if (query.length > 1) {
    throw new Error(`too many potential query params for ${route.url}`);
  }

  if (!query.length) {
    return;
  }

  let name = query[0].type;

  if (name.includes('[]')) {
    name = name.replace('[]', '');
    return { type: 'array', items: getSchemaOrThrow(config, name, s) };
  } else {
    return getSchemaOrThrow(config, name, s);
  }
}

export function getSchemaResponse(
  config: FluxConfig,
  route: FluxRoute,
  s: schemas,
) {
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

  if (name && name.includes('[]')) {
    return {
      [route.statusCode]: {
        type: 'array',
        items: getSchemaOrThrow(config, name.replace('[]', ''), s),
      },
    };
  }

  if (name) {
    return {
      [route.statusCode]: getSchemaOrThrow(config, name, s),
    };
  }

  return {
    [route.statusCode]: {},
  };
}

export function getSchemaBody(
  config: FluxConfig,
  route: FluxRoute,
  s: schemas,
) {
  const body = route.params.filter((x) => x.name === 'body');

  if (body.length > 1) {
    throw new Error(`too many potential body params for ${route.url}`);
  }

  if (!body.length) {
    return;
  }

  let name = body[0].type;

  if (name.includes('[]')) {
    name = name.replace('[]', '');
    return { type: 'array', items: getSchemaOrThrow(config, name, s) };
  } else {
    return getSchemaOrThrow(config, name, s);
  }
}
