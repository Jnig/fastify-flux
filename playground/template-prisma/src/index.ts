import { flux } from '@fluxapi/common';
import { openapi } from '@fluxapi/plugins';
import { TodoController } from '~/controllers/Todo.controller';

export default async function () {
  const fastify = await flux({
    plugins: [openapi()],
    controllers: [TodoController],
  });

  fastify.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
