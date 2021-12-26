import { GenerateApiParams } from 'swagger-typescript-api';
import { log } from '../log.js';

export async function generateSdk(sdk: GenerateApiParams) {
  const logFunction = console.log;

  let warning = [''] as string[];
  let error = [''] as string[];
  console.log = () => {};
  console.warn = (...message) => {
    warning.push(message.join(' '));
  };
  console.error = (...message) => {
    error.push(message.join(' '));
  };

  try {
    const generator = await import('swagger-typescript-api');
    await generator.default.generateApi(sdk);
  } catch (err: any) {
    console.error(err.message);
  }

  console.log = logFunction;

  if (warning.length > 1) {
    log({
      component: 'cli',
      warning: 'SDK warning',
      details: warning.join('\n'),
    });
  }

  if (error.length > 1) {
    log({ component: 'cli', error: 'SDK error', details: error.join('\n') });
  } else {
    log({ component: 'cli', success: 'SDK written to', details: sdk.output });
  }
}
