import { createFastifyInstance, FluxController, FluxOpenapi, FluxOpenapiUi } from 'fastify-flux';
import { TodoController } from '~/controllers/Todo.controller';

const fastify = createFastifyInstance();

fastify.register(FluxOpenapi);
fastify.register(FluxOpenapiUi);

fastify.register(FluxController, {
  controllers: [TodoController],
});

fastify.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
