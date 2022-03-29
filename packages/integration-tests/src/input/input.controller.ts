import { Controller, Get } from '@fluxapi/common';
import { InputEmptyQuery } from './input.schema';

@Controller('/inputs', { tags: ['responses'] })
export class InputController {
  @Get('/empty-query')
  async emptyQuery(query: InputEmptyQuery): Promise<void> {
    return;
  }
}
