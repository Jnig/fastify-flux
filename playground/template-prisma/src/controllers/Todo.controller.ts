import { Controller, Delete, Get, Post, Status } from '@fluxapi/common';
import { CreateTodo, ListTodoQuery, TodoResponse, UpdateTodo } from './Todo.schema';
import { HttpException } from '~/helper/exceptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('/todos', { tags: ['todos'] })
export class TodoController {
  @Get()
  async list(query: ListTodoQuery): Promise<TodoResponse[]> {
    const done = query.includeDone ? undefined : false;

    return prisma.todos.findMany({ where: { done } });
  }

  @Post()
  async create(body: CreateTodo): Promise<TodoResponse> {
    const result = await prisma.todos.create({ data: body });

    return result;
  }

  @Get('/:id')
  async get(id: number): Promise<TodoResponse> {
    const found = await prisma.todos.findUnique({ where: { id } });

    if (!found) {
      throw new HttpException(404, 'todo not found');
    }

    return found;
  }

  @Post('/:id')
  async update(id: number, body: UpdateTodo): Promise<TodoResponse> {
    const found = await prisma.todos.findUnique({ where: { id } });

    if (!found) {
      throw new HttpException(404, 'todo not found');
    }

    return prisma.todos.update({ where: { id }, data: body });
  }

  @Delete('/:id')
  @Status(204)
  async remove(id: number): Promise<void> {
    const found = await prisma.todos.findUnique({ where: { id } });

    if (!found) {
      throw new HttpException(404, 'todo not found');
    }

    await prisma.todos.delete({ where: { id } });
  }
}
