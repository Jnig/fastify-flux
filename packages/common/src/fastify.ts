import fastify from 'fastify';

function isPinoPrettyInstalled() {
  let installed = true
  try {
    require('pino-pretty')
  } catch (_) {
    installed = false
  }
  return installed
}

export function getFastifyLoggerConfig() {
  if (isPinoPrettyInstalled()) {
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
    logger: getFastifyLoggerConfig(),
    ajv: {
      customOptions: {
        removeAdditional: false, //throw error instead
      },
    },
  });
}
