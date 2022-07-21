const ItemManager = require("../services/item-manager.js");
const PokemonClient = require("../clients/pokemon-client.js");

const itemManager = new ItemManager();
const pokemonClient = new PokemonClient;

async function createTodo(req, res) {
  const todoText = req.body.text
  let newTodos = [];
  if (pokemonClient.isPokemon(todoText)) {
    newTodos = await addPokemon(todoText.toLowerCase());
  } else {
    const isTextNaN = todoText.split(',').map( el => isNaN(el));
    if (isTextNaN.includes(true)) {
      newTodos.push(await itemManager.addItem(todoText));
    } else {
      newTodos = await addPokemon(req.body.text);
    }
  }
  res.status(200).json(newTodos);
}

async function restoreTodo(req, res) {
  const { text, status, done } = req.body;
  const restoredTodo = await itemManager.restoreItem(text, status, done);
  res.status(200).json(restoredTodo);
}

async function addPokemon(text) {
  const pokemons = await pokemonClient.fetchPokemon(text);
  const newItems = [];
  for (const pokemon of pokemons) {
    let catchPokemonTodo;
    if (pokemon.success) {
      catchPokemonTodo = `Catch ${pokemon.name} with id ${pokemon.id} and type ${pokemon.type}`;
    } else {
      catchPokemonTodo = `${pokemon.name}`
    }
    newItems.push(await itemManager.addItem(catchPokemonTodo));
  }
  return newItems;
}

async function getTodo(req, res) {
  let todoId = Number.parseInt(req.params.id);
  ErrorIfNaN(todoId);
  const todo = await itemManager.getItem(todoId);
  if (!todo) {
    const error = Error()
    error.statusCode = 404;
    error.message = 'Not found';
    throw error;
  }
  res.status(200).json(todo);
}

async function health(req, res) {
  res.status(200).json({});
}

async function getAll(req, res) {
  let data = await itemManager.getAll();
  if (!data) data = [];
  res.status(200).json(data);
}

async function getAllWhere(req, res) {
  const text = req.query.text;
  let data = await itemManager.getAllWhere(text);
  res.status(200).json(data);
}

async function deleteTodo(req, res) {
  let todoId = Number.parseInt(req.params.id);
  ErrorIfNaN(todoId);
  const data = await itemManager.deleteItem(todoId);
  res.status(200).json(data);
}

async function markTodoAsOld(req, res) {
  const todoId = Number.parseInt(req.params.id);
  ErrorIfNaN(todoId);
  const data = await itemManager.markTodoAsOld(todoId);
  res.status(200).json(data);
}

async function changeStatus(req, res) {
  const todoId = Number.parseInt(req.params.id);
  ErrorIfNaN(todoId);
  const data = await itemManager.changeTodoStatus(todoId, req.body);
  res.status(200).json(data);
}

async function clearAll(req, res) {
  const data = await itemManager.clearAll();
  res.status(200).json(data);
}

function ErrorIfNaN(todoId) {
  if (isNaN(todoId)) {
    const error = Error()
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
}

module.exports = {
  getAll,
  getAllWhere,
  createTodo,
  getTodo,
  deleteTodo,
  markTodoAsOld,
  changeStatus,
  clearAll,
  restoreTodo,
  health
};
