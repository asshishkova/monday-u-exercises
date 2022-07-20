import axios from "axios";

async function getItems() {
  try {
    const response = await axios.get(`/api/todo`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function getItemsPending() {
  try {
    const response = await axios.get(`/api/pending`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function getItemsDone() {
  try {
    const response = await axios.get(`/api/done`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function getItemsWhere(searchText) {
  try {
    const response = await axios.get(`/api/search?text=${encodeURIComponent(searchText)}`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function deleteItem(item) {
  try {
    const response = await axios.delete(`/api/todo/${item.id}`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function markItemAsOld(item) {
  try {
    const response = await axios.post(`/api/todo/${item.id}/markold`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function changeItemStatus(item) {
  const doneTime = item.done === null? Date.now() : null;
  try {
    const response = await axios.post(
      `/api/todo/${item.id}/changestatus`,
      {
        status: !item.status,
        done: doneTime
      }
    );
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function createItem(itemText) {
  try {
    const response = await axios.post(`/api/todo`, { text: itemText });
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function restoreItem(item) {
  const {text, status, done} = item;
  try {
    const response = await axios.post(`/api/restore`,
                                      { text: text, status: status, done: done });
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function clearAllItems() {
  try {
    const response = await axios.delete(`/api/clearall`);
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

export {
  getItems,
  getItemsPending,
  getItemsDone,
  getItemsWhere,
  deleteItem,
  markItemAsOld,
  changeItemStatus,
  createItem,
  clearAllItems,
  restoreItem
}
