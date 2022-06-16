// Define your endpoints here (this is your "controller file")

import { ItemManager } from "../services/item_manager.js";
import { PokemonClient } from "../clients/pokemon_client.js";

const itemManager = new ItemManager();
itemManager.init();
const pokemonClient = new PokemonClient;

async function createTodo(req, res) {
  let newTodos = [];
  if (pokemonClient.isPokemon(req.body.text)) {
    newTodos = await addPokemon(req.body.text.toLowerCase());
  } else {
    const isTextNaN = req.body.text.split(',').map( el => isNaN(el));
    if (isTextNaN.includes(true)) {
      console.log(`Adding ${req.body.text}`);
      newTodos.push(await itemManager.addItem(req.body.text));
    } else {
      newTodos = await addPokemon(req.body.text);
    }
  }
  res.status(200).json(newTodos);
}

async function addPokemon(text) {
  const pokemons = await pokemonClient.fetchPokemon(text);
  const newItems = [];
  try {
    for (const pokemon of pokemons) {
      const catchPokemonTodo = `Catch ${pokemon.name} with id ${pokemon.id} and type ${pokemon.type}`;
      newItems.push(await itemManager.addItem(catchPokemonTodo));
    }
  } catch (error) {
    newItems.push(await itemManager.addItem(`Failed to fetch ${text}`));
    console.log("Todo was not added: ", error);
  }
  return newItems;
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

async function updateTodo(req, res) {
  const todoId = Number.parseInt(req.params.id);
  if (isNaN(todoId)) {
    let error = Error();
    error.statusCode = 400;
    error.message = 'Wrong parameters';
    throw error;
  }
  const data = await itemManager.updateItem(todoId, req.body);
  res.status(200).json(data);
}

async function sortTodos(req, res) {
  const data = await itemManager.sortItems();
  res.status(200).json(data);
}

export {
  createTodo,
  getTodo,
  getAll,
  deleteTodo,
  updateTodo,
  sortTodos
};
