import { flux } from '@fluxapi/common';
import { openapi } from '@fluxapi/plugins';
import { TodoController } from '~/controllers/Todo.controller';

const fastify = flux({
  plugins: [openapi()],
  controllers: [TodoController],
});

fastify.listen(8080, '127.0.0.1', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
