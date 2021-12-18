import { todos } from '@prisma/client';

export interface TodoResponse extends todos {}

export interface CreateTodo extends Omit<TodoResponse, 'id' | 'done' | 'createdAt'> {}

export interface UpdateTodo extends Partial<Omit<TodoResponse, 'id'>> {}

export interface ListTodoQuery {
  includeDone?: boolean;
}
