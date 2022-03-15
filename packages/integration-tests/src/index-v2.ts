import { flux } from '@fluxapi/common';
import { openapi } from '@fluxapi/plugins';
import { V2Controller } from './v2/v2.controller';

const fastify = flux({
  plugins: [openapi()],
  controllers: [V2Controller],
});

fastify.listen(8081, '127.0.0.1', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
