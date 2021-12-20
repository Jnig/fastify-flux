import { FastifyInstance } from 'fastify';
import swagger, { FastifyDynamicSwaggerOptions } from 'fastify-swagger';
import { readFileSync, writeFileSync } from 'fs';
import { FluxPlugin, getFluxJsonSchema } from '@fluxapi/common';

interface SwaggerOptionsFixed extends FastifyDynamicSwaggerOptions {
  refResolver?: { buildLocalReference: (json: { $id: string }) => string };
}

export function openapi(additionalOptions?: SwaggerOptionsFixed): FluxPlugin {
  const options: SwaggerOptionsFixed = {
    routePrefix: '/',
    refResolver: {
      buildLocalReference(json) {
        return json.$id;
      },
    },
    openapi: {
      info: {
        title: 'Api',
        description: '',
        version: '',
      },
    },
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    exposeRoute: true,
  };

  return (fastify: FastifyInstance) => {
    fastify.register(swagger, options);

    const schema = getFluxJsonSchema();
    Object.values(schema).forEach((entity: unknown) => {
      fastify.addSchema(entity);
    });

    fastify.ready(async () => {
      const oas: any = fastify.swagger();

      const file = `${process.cwd()}/dist/openapi.json`;
      const schema = JSON.stringify(oas, null, 2);

      let old = '';
      try {
        old = readFileSync(file, 'utf-8');
        // eslint-disable-next-line no-empty
      } catch (err) {}

      if (old !== schema) {
        writeFileSync(file, schema);
      }
    });
  };
}
