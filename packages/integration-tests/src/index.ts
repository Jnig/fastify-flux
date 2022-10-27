import { createFastifyInstance, FluxController, FluxOpenapi, FluxOpenapiUi } from 'fastify-flux';
import { CrudController } from './crud/crud.controller';
import { InputController } from './input/input.controller';
import { ResponseController } from './response/response.controller';

const fastify = createFastifyInstance();

fastify.register(FluxOpenapi);
fastify.register(FluxOpenapiUi);
fastify.register(FluxController, {
  controllers: [ResponseController, CrudController, InputController],
});

fastify.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
