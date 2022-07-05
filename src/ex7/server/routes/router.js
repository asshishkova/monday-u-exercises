const express = require('express');
const { validateCreateTodoSchema } =  require("../middleware/validation.js");
const {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
  markTodoAsOld,
  changeStatus,
  clearAll
} = require("./api.js");

const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', validateCreateTodoSchema(), createTodo);
todoRouter.delete('/:id', deleteTodo);
todoRouter.post('/:id/markold', markTodoAsOld);
todoRouter.post('/:id/changestatus', changeStatus);
todoRouter.post('/clearall', clearAll);

module.exports = todoRouter;
