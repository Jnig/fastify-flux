import { GenerateApiParams } from 'swagger-typescript-api';

export interface FluxCliConfig {
  sdk: GenerateApiParams;
  watch: {
    exec: { command: string; args: string[] }[];
  };
}
