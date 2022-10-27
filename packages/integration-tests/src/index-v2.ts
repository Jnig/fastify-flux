import { createFastifyInstance, FluxController, FluxOpenapi, FluxOpenapiUi } from 'fastify-flux';
import { V2Controller } from './v2/v2.controller';

const fastify = createFastifyInstance();
fastify.register(FluxOpenapi);
fastify.register(FluxOpenapiUi);
fastify.register(FluxController, {
  controllers: [V2Controller],
  prefix: '/api',
});

fastify.listen({ port: 8081, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
