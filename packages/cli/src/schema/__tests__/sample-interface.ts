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
  object2?: Record<string, any> | null;
  anyObject2?: { [key: string]: string } | null;
  anyString: any;
  anyArray: any[];
  stringArray?: string[];
  complexArray?: { foo: string; bar: number }[];
}

interface enumSample {
  barcode: 'code128' | 'qr';
}

import { Controller, Get } from '../../../../common/dist';

@Controller('/v2', { tags: ['v2'] })
export class V2Controller {
  @Get()
  async string(s1: simple,
    s2: simpleUndefinedNull,
    s3: simpleNested,
    s4: simple[],
    s5: complex,
    s6: enumSample,
  ): Promise<foobar> {
    return { id: 1, checked: true, mixed: 'foo' };
  }
}
