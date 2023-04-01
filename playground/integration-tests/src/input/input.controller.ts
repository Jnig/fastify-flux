import { Controller, Get } from 'fastify-flux';
import { InputEmptyQuery, InputEmptyStringNull } from './input.schema';

@Controller('/inputs', { tags: ['input'] })
export class InputController {
  @Get('/empty-query')
  async emptyQuery(query: InputEmptyQuery): Promise<void> {
    return;
  }

  @Get('/empty-string-null')
  async emptyStringNull(query: InputEmptyStringNull): Promise<any> {
    return query;
  }
}
