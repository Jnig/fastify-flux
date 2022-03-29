import { flux } from '@fluxapi/common';
import { openapi } from '@fluxapi/plugins';
import { CrudController } from './crud/crud.controller';
import { InputController } from './input/input.controller';
import { ResponseController } from './response/response.controller';

const fastify = flux({
  plugins: [openapi()],
  controllers: [ResponseController, CrudController, InputController],
});

fastify.listen(8080, '127.0.0.1', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
