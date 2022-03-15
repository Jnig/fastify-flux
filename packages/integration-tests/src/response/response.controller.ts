import { Controller, Delete, Get, Status } from '@fluxapi/common';
import { AnyResponse, NullResponse, ObjectResponse, AddionalResponse, UndefinedResponse } from './response.schema';

@Controller('/responses', { tags: ['responses'] })
export class ResponseController {
  @Delete('/void')
  @Status(204)
  async voidResponse(): Promise<void> {
    return;
  }

  @Get('/string')
  async string(): Promise<string> {
    return 'foo';
  }

  @Get('/number')
  async number(): Promise<number> {
    return 3;
  }

  @Get('/any')
  async any(): Promise<any> {
    return { foo: 'bar' };
  }

  @Get('/remove-additional')
  async removeAdditional(): Promise<AddionalResponse> {
    // should remove property foo and email
    return { id: 1, foo: true, user: { id: 1, name: 'foobar', email: 'foobar@local' } } as any;
  }

  @Get('/null-property')
  async nullProperty(): Promise<NullResponse> {
    // should remove property email and return null for userNull
    return { id: 1, user: { id: 1, name: 'foobar', email: 'foobar@local' }, userNull: null } as any;
  }

  @Get('/object-response')
  async objectResponse(): Promise<ObjectResponse> {
    return { id: 1, anyRecord: { foo: 'bar' }, anyObject: { foo: 'bar' }, stringObject: { foo: 'bar' } };
  }

  @Get('/any-response')
  async anyResponse(): Promise<AnyResponse> {
    return {
      id: 1,
      anyString: 'bar',
      anyArray: [1, 2, 3],
      anyObject: { foo: 'bar' },
      multiNull: null,
      multiNumber: 2,
      multiString: 'dsad',
    };
  }

  @Get('/undefined-response')
  async undefinedResponse(): Promise<UndefinedResponse> {
    return {
      id: 1,
      string: 'bar',
      object: { id: 1, name: 'string', foo: 'bar' } as any,
      //objectUndefined,
      objectNull: { id: 1, name: 'string', foo: 'bar' } as any,
      objectNullUndefined: null,
    };
  }
}
