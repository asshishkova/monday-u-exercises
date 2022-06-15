// Define your endpoints here (this is your "controller file")

import { ItemManager } from "../services/item_manager.js";

const itemManager = new ItemManager();
itemManager.init();

async function createTodo(req, res) {
  console.log(`Adding ${req.body.text}`);
  await itemManager.addItem(req.body);
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
  const todo = await itemManager.getItem(todoId);
  if (!todo) {
    let error = Error();
    error.statusCode = 404;
    error.message = 'Not found';
    throw error;
  }
  res.status(200).json(todo);
}

async function getAll(req, res) {
  let data = await itemManager.getAll();
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
  const data = await itemManager.deleteItem(todoId);
  res.status(200).json(data);
}

export {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
};
