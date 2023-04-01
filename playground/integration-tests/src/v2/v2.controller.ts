import { Controller, Get } from 'fastify-flux';
import { V2Response } from './v2.schema';

@Controller('/v2', { tags: ['v2'] })
export class V2Controller {
  @Get()
  async string(): Promise<V2Response> {
    return { foo: 'bar' };
  }
}
