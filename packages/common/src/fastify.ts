import fastify from 'fastify';

export function createFastifyInstance() {
  return fastify({
    logger: {
      prettyPrint:
        process.env.NODE_ENV !== 'production'
          ? {
              ignore: 'pid,hostname,time',
            }
          : false,
    },
    ajv: {
      customOptions: {
        removeAdditional: false, //throw error instead
      },
    },
  });
}
