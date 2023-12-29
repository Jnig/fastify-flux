interface nested {
  id: number;
}

interface foobar {
  checked: boolean | null;
  id: number;
  done?: boolean;
  mixed: string | boolean | null;
  nested?: nested;
  nestedArray?: nested[];
}

import { Controller, Get } from '../../../../common/dist';

@Controller('/v2', { tags: ['v2'] })
export class V2Controller {
  @Get()
  async string(input: foobar): Promise<foobar> {
    return { id: 1, checked: true, mixed: 'foo' };
  }

  @Get()
  async list(input: foobar): Promise<foobar[]> {
    return [{ id: 1, checked: true, mixed: 'foo' }];
  }

  @Get()
  async none(input: foobar): Promise<void> {
  }
}
