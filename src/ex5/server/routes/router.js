const express = require('express');
const {validateSchema, createTodoSchema} =  require("../middleware/validation.js");
const {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
  markTodoAsOld,
  changeStatus,
  clearAll,
  sortTodos
} = require("./api.js");

const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', validateSchema(createTodoSchema), createTodo);
todoRouter.delete('/:id', deleteTodo);
todoRouter.post('/:id/markold', markTodoAsOld);
todoRouter.post('/:id/changestatus', changeStatus);
todoRouter.post('/clearall', clearAll);
todoRouter.post('/sort', sortTodos);

module.exports = todoRouter;
