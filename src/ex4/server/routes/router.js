import express from "express";
// const {validateSchema, jediSchema} = require("../middleware/validation");
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
todoRouter.post('/', createTodo);
todoRouter.delete('/:id', deleteTodo);
todoRouter.patch('/:id', updateTodo);
todoRouter.post('/clearall', clearAll);
todoRouter.post('/sort', sortTodos);
