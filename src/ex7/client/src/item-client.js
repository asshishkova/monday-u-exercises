import axios from "axios";

async function getItems() {
  try {
    const response = await axios.get(`/todo`);
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function getItemsPending() {
  try {
    const response = await axios.get(`/pending`);
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function getItemsDone() {
  try {
    const response = await axios.get(`/done`);
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function getItemsWhere(searchText) {
  try {
    const response = await axios.get(`/search/${searchText}`);
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function deleteItem(item) {
  try {
    const response = await axios.delete(`/todo/${item.id}`);
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function markItemAsOld(item) {
  try {
    const response = await axios.post(`/todo/${item.id}/markold`);
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function changeItemStatus(item) {
  const doneTime = item.done === null? Date.now() : null;
  try {
    const response = await axios.post(
      `/todo/${item.id}/changestatus`,
      {
        status: !item.status,
        done: doneTime
      }
    );
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

async function createItem(itemText) {
  try {
    const response = await axios.post(`/todo`, { text: itemText });
    return response.data;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

async function clearAllItems() {
  try {
    const response = await axios.delete(`/clearall`);
    return response.data;
  }
  catch (error) {
    console.error(error);
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
}
