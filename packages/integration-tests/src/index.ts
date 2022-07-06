import { flux } from '@fluxapi/common';
import { openapi } from '@fluxapi/plugins';
import { CrudController } from './crud/crud.controller';
import { InputController } from './input/input.controller';
import { ResponseController } from './response/response.controller';

export default async function () {
  const fastify = await flux({
    plugins: [openapi()],
    controllers: [ResponseController, CrudController, InputController],
  });

  fastify.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
