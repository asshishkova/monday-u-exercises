// Define your endpoints here (this is your "controller file")

import { ItemManager } from "../services/item_manager.js";
import { PokemonClient } from "../clients/pokemon_client.js";

const itemManager = new ItemManager();
try {
  itemManager.init();
} catch (error) {
  throw error;
}
const pokemonClient = new PokemonClient;

async function createTodo(req, res) {
  const todoText = req.body.text;
  let newTodos = [];
  if (pokemonClient.isPokemon(todoText)) {
    newTodos = await addPokemon(todoText.toLowerCase());
  } else {
    const isTextNaN = todoText.split(',').map( el => isNaN(el));
    if (isTextNaN.includes(true)) {
      console.log(`Adding ${todoText}`);
      newTodos.push(await itemManager.addItem(todoText));
    } else {
      newTodos = await addPokemon(todoText);
    }
  }
  res.status(200).json(newTodos);
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
  if (isNaN(todoId)){
    const error = Error();
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
  const todo = await itemManager.getItem(todoId);
  if (!todo) {
    const error = Error();
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
    const error = Error();
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
  const data = await itemManager.deleteItem(todoId);
  res.status(200).json(data);
}

async function markTodoAsOld(req, res) {
  const todoId = Number.parseInt(req.params.id);
  if (isNaN(todoId)) {
    const error = Error();
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
  const data = await itemManager.updateItem(todoId, {isNew: false});
  res.status(200).json(data);
}

async function clearAll(req, res) {
  const data = await itemManager.clearAll();
  res.status(200).json(data);
}

async function sortTodos(req, res) {
  const data = await itemManager.sortItems();
  res.status(200).json(data);
}

export {
  getAll,
  createTodo,
  getTodo,
  deleteTodo,
  markTodoAsOld,
  clearAll,
  sortTodos
};
