import fp from 'fastify-plugin';

import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { registerController } from './flux/controllers';
import { openapi, openapiUi } from './openapi';
import { FluxConfig } from './types';
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

export * from './decorator';
export * from './flux';
export * from './types';
export * from './meta';
export * from './fastify';

const FluxOpenapiHelper: FastifyPluginAsync<
  FastifyDynamicSwaggerOptions
> = async (fastify: FastifyInstance, options) => {
  openapi(fastify, options);
};

const FluxOpenapiUiHelper: FastifyPluginAsync<
  FastifySwaggerUiOptions
> = async (fastify: FastifyInstance, options) => {
  openapiUi(fastify, options);
};

interface ControllerOptions {
  controllers: { new(): any }[];
  mapping?: FluxConfig['mapping'];
}

const FluxControllerHelper: FastifyPluginAsync<ControllerOptions> = async (
  fastify: FastifyInstance,
  options,
) => {
  options.controllers.forEach((controller) => {
    registerController(controller, { fastify, mapping: options.mapping });
  });
};

export const FluxOpenapi = fp(FluxOpenapiHelper);
export const FluxOpenapiUi = fp(FluxOpenapiUiHelper);
export const FluxController = fp(FluxControllerHelper);
