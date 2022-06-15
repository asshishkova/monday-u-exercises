import express from "express";
// const {validateSchema, jediSchema} = require("../middleware/validation");
import {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
} from "./api.js";

export const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', createTodo);
todoRouter.delete('/:id', deleteTodo);