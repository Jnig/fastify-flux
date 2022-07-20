import fastify from 'fastify';

function getLoggerConfig() {
  if (process.env.NODE_ENV !== 'production') {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore:
            'req.hostname,req.remotePort,req.remoteAddress,time,hostname,pid',
          singleLine: true,
          sync: true,
        },
      },
    };
  }

  return {};
}

export function createFastifyInstance() {
  return fastify({
    logger: getLoggerConfig(),
    ajv: {
      customOptions: {
        removeAdditional: false, //throw error instead
      },
    },
  });
}
