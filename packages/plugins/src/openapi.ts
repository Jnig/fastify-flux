import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import swagger, { FastifyDynamicSwaggerOptions } from 'fastify-swagger';
import { readFileSync, writeFileSync } from 'fs';
import { FluxPlugin, getFluxJsonSchema } from '@fluxapi/common';

export function openapi(
  additionalOptions?: FastifyDynamicSwaggerOptions,
): FluxPlugin {
  const options: FastifyDynamicSwaggerOptions = {
    routePrefix: '/',
    refResolver: {
      buildLocalReference(json: any) {
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
    fastify.register(swagger, _.merge(options, additionalOptions));

    fastify.ready(async () => {
      const { FLUX_PROJECT_INDEX } = process.env;
      if (!FLUX_PROJECT_INDEX) {
        return;
      }

      const oas: any = (fastify as any).swagger();

      const file = `${process.cwd()}/dist/openapi-${FLUX_PROJECT_INDEX}.json`;
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
