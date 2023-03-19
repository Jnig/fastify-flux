<p align="center">
  <a href="https://github.com/fluxapi/fluxapi" target="_blank" rel="noopener noreferrer">
    <img width="180" src="./logo.png" alt="Flux logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://www.npmjs.com/package/@fluxapi/cli"><img src="https://img.shields.io/npm/v/@fluxapi/cli.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@fluxapi/cli.svg" alt="node compatibility"></a>
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="license">

</p>
<br/>

# FluxAPI ⚡

> Delightful API development

- 💡 Instant server start with <a href="https://github.com/evanw/esbuild" target="_blank">esbuild</a>
- 🎯 Automatic reloads and optional type checking
- ⚡️ Lightning fast http requests with <a href="https://github.com/fastify/fastify" target="_blank">fastify</a>
- 🛠️ E2E tests with [jest](https://github.com/facebook/jest)
- 📦 OpenAPI v3
- 🔋 Batteries included: A typed client SDK is automatically generated with <a href="https://github.com/acacode/swagger-typescript-api" target="_blank">swagger-typescript-api</a>

FluxAPI is a new API build tool that significantly improves the development experience. Typescript interfaces are automatically converted into JSON schema.

## Quickstart

```sh
npx create-fastify-flux@latest
```

Run the command and follow the instructions. Afterwards you will have an OpenAPI documentation at http://localhost:8080/ and a client SDK generated in the file `GeneratedApi.ts`.

## Motivation

There are great Node.js frameworks for building APIs with decorators. However using those can get very verbose. Consider the following example:

```ts
export class UpdateTodoDto {
  @IsInt()
  readonly id: number;

  @IsString()
  readonly name: string;
}

@Post('/:id')
@ApiResponse({
  type: Todo,
})
async update(@Param('id') id: number, @Body() body: UpdateTodoDto): Promise<Todo> {
  // implementation
}
```

The parameter decorators make the example slightly hard to read. The @ApiResponse type is redundant with function return type `Promise<Todo>`.

With FluxAPI the same can be achieved with the following:

```ts
interface UpdateTodo {
  id number;
  name: string;
}

@Post('/:id')
async update(id: number, body: UpdateTodo): Promise<Todo> {
  // implementation
}
```

The id parameter is matched with the path `/:id` and the body is provided to the paramter named body. The function return type is converted into an OpenApi response.

Another advantage is that you can leverage the interfaces which are provided by a database framework e.g. prisma, because it's no longer necessary to create a Dto class.

## Usage

The following code snippets are only provided as example. It's best to start a new project via
`npm create flux`.

### Define a controller

`Todo.controller.ts`

```ts
import { Controller, Delete, Get, Post, Status } from '@fluxapi/common';
import {
  CreateTodo,
  ListTodoQuery,
  TodoResponse,
  UpdateTodo,
} from './Todo.schema';

@Controller('/todos', { tags: ['todos'] })
export class TodoController {
  @Get()
  async list(query: ListTodoQuery): Promise<TodoResponse[]> {
    // implementation
  }

  @Post()
  async create(body: CreateTodo): Promise<TodoResponse> {
    // implementation
  }

  @Get('/:id')
  async get(id: number): Promise<TodoResponse> {
    // implementation
  }

  @Post('/:id')
  async update(id: number, body: UpdateTodo): Promise<TodoResponse> {
    // implementation
  }

  @Delete('/:id')
  @Status(204)
  async remove(id: number): Promise<void> {
    // implementation
  }
}
```

### Define the schema

Schema files must end with `schema.ts`

`Todo.schema.ts`

```ts
interface Todo {
  id number;
  name: string;
  done: boolean;
}

export interface TodoResponse extends Todo {}

export interface CreateTodo extends Omit<TodoResponse, 'id'> {}

export interface UpdateTodo extends Partial<Omit<TodoResponse, 'id'>> {}

export interface ListTodoQuery {
  includeDone?: boolean;
}

```

### Create the server

`index.ts`

```ts
import Fastify from 'fastify';
import { FluxController, FluxOpenapi } from 'fastify-flux';
import { TodoController } from '~/Todo.controller';

const fastify = Fastify();

fastify.register(FluxOpenapi);
fastify.register(FluxController, {
  controllers: [TodoController],
});

fastify.listen(8080, '127.0.0.1', (err, address) => {
  console.log(`Server listening at ${address}`);
});
```

## Frequently Asked Questions

<details>
  <summary>How to provide additional JSON Schema properties?</summary>

You can use JSDoc to provide additional JSON Schema properties. You can also find more examples in the [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator) repository.

```ts
/**
 * @title Some title here
 * @description Some description here
 */
export interface MyObject {
  /**
   * @description Export field description
   * @default 'foobar'
   */
  name: string;
}
```

</details>

<details>
  <summary>How to configure the OpenAPI documentation?</summary>

The openapi function accepts all options from [fastify-swagger](https://github.com/fastify/fastify-swagger).

```ts
fastify.register(FluxOpenapi, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
  },
});
```

</details>

<details>
  <summary>Which function parameters are mapped and how to provide additional mappings?</summary>

Mappings can be provided by parameter `name` or `type`. The following mappings are provided by default and can be extended.

```ts
const fastify = flux({
  mapping: [
    {
      name: 'query',
      mapper({ request }) {
        return request.query;
      },
    },
    {
      name: 'body',
      mapper({ request }) {
        return request.body;
      },
    },
    {
      type: 'FastifyReply',
      mapper({ reply }) {
        return reply;
      },
    },
    {
      type: 'FastifyRequest',
      mapper({ request }) {
        return request;
      },
    },
  ],
});
```

</details>

<details>
  <summary>How can I add authentication and authorization to the API?</summary>

For authentication fastify hooks can be used to identify user by a Token, JWT or anyhing else.

The `@Auth` decorator can be used to add values like roles or permissions to an endpoint. Via `reply.context.config.auth` the added value can be used in fastify hooks.

```ts
@Post()
@Auth('admin')
async create(body: CreateTodo): Promise<TodoResponse> {
}
```

```ts
fastify.addHook('onRequest', async (request, reply) => {
  const { auth } = reply.context.config;
  if (!request.user.roles.includes(auth)) {
    throw new Error();
  }
});
```

</details>

## Alternatives to consider

The following frameworks were used as inspiration.

[NestJS](https://github.com/nestjs/nest), [Ts.ED](https://github.com/tsedio/tsed), [tsoa](https://github.com/lukeautry/tsoa)
