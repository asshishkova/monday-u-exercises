import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TodoElement } from "./todo-element.js";
import { ItemClient } from "../item_client.js";

export function TodosList() {

  const [todos, setTodos] = useState([]);

  // const itemClient = new ItemClient();
  const itemClient = useMemo( () => {
    return new ItemClient();
  },[])

  const getTodos = useCallback(async () => {
    setTodos(await itemClient.getItems());
  },[itemClient])
  // const getTodos = async () => {
  //   setTodos(await itemClient.getItems());
  // }

  useEffect(() => {
    getTodos();
  }, [getTodos]);



  // const todos = itemClient.getItems();

  // const todos = [
  //   {id: 1, text: 'abc', status: false, done: null},
  //   {id: 2, text: 'abcsdsd', status: true, done: "today"},
  //   {id: 3, text: '111', status: true, done: "yesterday"},
  // ];


  return (
    <ul id="todos-list">
      {
        todos.map(todo => {
          return <TodoElement key={todo.id} text={todo.text} status={todo.status} done={todo.done}/>
        })
      }
    </ul>
  )
}
