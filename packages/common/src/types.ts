import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HTTPMethods,
} from 'fastify';

export interface FluxContext {
  request: FastifyRequest;
  reply: FastifyReply;
  route: FluxRoute;
}

export interface FluxRoutes {
  [functionName: string]: FluxRoute;
}

export interface FluxRoute {
  url: string;
  method: HTTPMethods;
  tags: string[];
  statusCode: number;
  returnType: string;
  params: { name: string; type: string, schema: any }[];
  returnSchema: any;
  auth?: unknown;
  [key: string]: unknown; // custom properties
}

export interface FluxMapping {
  type?: string;
  name?: string;
  mapper: (data: { request: FastifyRequest; reply: FastifyReply }) => unknown;
}

export interface FluxConfig {
  fastify: FastifyInstance;
  mapping?: FluxMapping[];
}

export type FluxController = new () => any;

declare module 'fastify' {
  interface FastifyContextConfig extends FluxRoute { }
}
