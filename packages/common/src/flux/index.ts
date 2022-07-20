import fastify, { FastifyInstance } from 'fastify';
import { createFastifyInstance } from '../fastify';
import { FluxController, FluxConfig } from '../types';
import { registerController } from './controllers';

class Flux {
  controllersRegistered = false;

  constructor(private config: FluxConfig) {}

  controllers(...controllers: FluxController[]) {
    controllers.forEach((controller) =>
      registerController(controller, this.config),
    );
    this.controllersRegistered = true;
  }

  getFastify() {
    return this.config.fastify;
  }
}

export async function flux({
  fastify,
  controllers,
  mapping,
}: {
  fastify?: FastifyInstance;
  controllers?: FluxController[];
  mapping?: FluxConfig['mapping'];
}) {
  const instance = new Flux({
    fastify: fastify ? fastify : createFastifyInstance(),
    mapping,
  });

  if (controllers) {
    instance.controllers(...controllers);
  }

  return instance.getFastify();
}
