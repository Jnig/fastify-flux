import fastify, { FastifyInstance } from 'fastify';
import { FluxController, FluxPlugin, FluxConfig } from '../types';
import { registerController } from './controllers';

class Flux {
  controllersRegistered = false;

  constructor(private config: FluxConfig) {}

  plugins(...plugins: FluxPlugin[]) {
    if (this.controllersRegistered) {
      throw new Error('Plugins must be registered before Controllers.');
    }
    plugins.forEach((plugin) => plugin(this.config.fastify));
  }

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

export function flux({
  fastifyInstance,
  controllers,
  plugins,
  mapping,
}: {
  fastifyInstance?: FastifyInstance;
  controllers?: FluxController[];
  plugins?: FluxPlugin[];
  mapping?: FluxConfig['mapping'];
}) {
  const instance = new Flux({
    fastify: fastifyInstance ? fastifyInstance : fastify(),
    mapping,
  });

  if (plugins) {
    instance.plugins(...plugins);
  }

  if (controllers) {
    instance.controllers(...controllers);
  }

  return instance.getFastify();
}
