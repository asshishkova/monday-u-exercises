import express from "express";
import {validateSchema, createTodoSchema} from "../middleware/validation.js";
import {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
  markTodoAsOld,
  clearAll,
  sortTodos
} from "./api.js";

export const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', validateSchema(createTodoSchema), createTodo);
todoRouter.delete('/:id', deleteTodo);
todoRouter.post('/:id/markold', markTodoAsOld);
todoRouter.delete('/', clearAll);
todoRouter.post('/sort', sortTodos);
