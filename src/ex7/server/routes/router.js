const express = require('express');
const { validateCreateTodoSchema } =  require("../middleware/validation.js");
const {
  createTodo,
  getTodo,
  getAll,
  getAllDone,
  getAllPending,
  getAllWhere,
  deleteTodo,
  markTodoAsOld,
  changeStatus,
  clearAll
} = require("./api.js");

const todoRouter = express.Router();

todoRouter.get('/todo', getAll);
todoRouter.get('/pending', getAllPending);
todoRouter.get('/done', getAllDone);
todoRouter.get('/search/:text', getAllWhere);
todoRouter.get('/todo/:id', getTodo);
todoRouter.post('/todo', validateCreateTodoSchema(), createTodo);
todoRouter.delete('/todo/:id', deleteTodo);
todoRouter.post('/todo/:id/markold', markTodoAsOld);
todoRouter.post('/todo/:id/changestatus', changeStatus);
todoRouter.delete('/clearall', clearAll);

module.exports = todoRouter;
