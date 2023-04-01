import { Controller, Delete, Get, Post, Status } from 'fastify-flux';
import { CreateTodo, ListTodoQuery, TodoResponse, UpdateTodo } from './crud.schema';
import { HttpException } from '~/helper/exceptions';

const todos: TodoResponse[] = [];

@Controller('/todos', { tags: ['todos'] })
export class CrudController {
  @Get()
  async list(query: ListTodoQuery): Promise<TodoResponse[]> {
    const done = query.includeDone ? undefined : false;

    return todos;
  }

  @Post()
  async create(body: CreateTodo): Promise<TodoResponse> {
    const result = { id: new Date().getTime(), ...body, done: false, createdAt: new Date() };
    todos.push(result);

    return result;
  }

  @Get('/:id')
  async get(id: number): Promise<TodoResponse> {
    const found = todos.find((x) => x.id === id);

    if (!found) {
      throw new HttpException(404, 'todo not found');
    }

    return found;
  }

  @Post('/:id')
  async update(id: number, body: UpdateTodo): Promise<TodoResponse> {
    const found = todos.find((x) => x.id === id);

    if (!found) {
      throw new HttpException(404, 'todo not found');
    }

    Object.assign(found, body);

    return found;
  }

  @Delete('/:id')
  @Status(204)
  async remove(id: number): Promise<void> {
    const found = todos.find((x) => x.id === id);

    if (!found) {
      throw new HttpException(404, 'todo not found');
    }

    const index = todos.findIndex((x) => {
      return x.id === id;
    });
    todos.splice(index, 1);
  }
}
