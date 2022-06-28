const express = require('express');
const {validateSchema, createTodoSchema, updateTodoSchema} =  require("../middleware/validation.js");
const {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
  markTodoAsOld,
  updateTodo,
  clearAll,
  sortTodos
} = require("./api.js");

const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', validateSchema(createTodoSchema), createTodo);
todoRouter.delete('/:id', deleteTodo);
todoRouter.patch('/:id', updateTodo);
todoRouter.post('/:id/markold', markTodoAsOld);
todoRouter.post('/clearall', clearAll);
todoRouter.post('/sort', sortTodos);

module.exports = todoRouter;
