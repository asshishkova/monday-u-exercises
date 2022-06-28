import express from "express";
import {validateSchema, createTodoSchema, updateTodoSchema} from "../middleware/validation.js";
import {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
  updateTodo,
  clearAll,
  sortTodos
} from "./api.js";

export const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', validateSchema(createTodoSchema), createTodo);
todoRouter.delete('/:id', deleteTodo);
todoRouter.patch('/:id', validateSchema(updateTodoSchema), updateTodo);
todoRouter.delete('/', clearAll);
todoRouter.post('/sort', sortTodos);
