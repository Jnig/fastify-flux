import { Api } from './generated-api';
import { Api as Api2 } from './generated-api-v2';

export const client = new Api({ baseURL: 'http://127.0.0.1:8080' });
export const client2 = new Api2({ baseURL: 'http://127.0.0.1:8081' });
