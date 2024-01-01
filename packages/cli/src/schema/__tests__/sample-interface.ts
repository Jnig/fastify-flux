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

interface simple {
  checked: boolean;
}

interface simpleUndefinedNull {
  checked?: boolean | null;
}

interface simpleNested {
  checked?: { id: number } | null;
}

interface complex {
  object: Record<string, any>
  anyObject: { [key: string]: string };
}

import { Controller, Get } from '../../../../common/dist';

@Controller('/v2', { tags: ['v2'] })
export class V2Controller {
  @Get()
  async string(s1: simple, s2: simpleUndefinedNull, s3: simpleNested, s4: simple[], s5: complex): Promise<foobar> {
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
