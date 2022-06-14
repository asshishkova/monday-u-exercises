// Define your endpoints here (this is your "controller file")

import { ItemManager } from "../services/item_manager.js";

async function createTodo(req, res) {
  console.log("Saving todo");
  await ItemManager.addItem(req.body);
  res.status(200).json(req.body);
}

async function getTodo(req, res) {
  let todoId = Number.parseInt(req.params.id);
  if (isNaN(todoId)){
    let error = Error();
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
  const todo = await ItemManager.getTodo(todoId);
  if (!todo) {
    let error = Error();
    error.statusCode = 404;
    error.message = 'Not found';
    throw error;
  }
  res.status(200).json(jedi);
}

async function getAll(req, res) {
  let data = await ItemManager.getAll();
  if (!data) data = [];
  res.status(200).json(data);
}

async function deleteTodo(req, res) {
  let todoId = Number.parseInt(req.params.id);
  if (isNaN(todoId)) {
    let error = Error();
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
  const data = await ItemManager.deleteTodo(todoId);
  res.status(200).json(data);
}

module.exports = {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
};
