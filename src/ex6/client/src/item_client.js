import axios from "axios";

async function getItems() {
  try {
    const response = await axios.get(`/todo`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function deleteItem(item) {
  try {
    const response = await axios.delete(`/todo/${item.id}`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function markItemAsOld(item) {
  try {
    const response = await axios.post(`/todo/${item.id}/markold`);
    return response.data;
  }
  catch (error) {
    console.log(error);
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
    console.log(error);
  }
}

async function createItem(itemText) {
  try {
    const response = await axios.post(`/todo`, {text: itemText});
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function clearAllItems() {
  try {
    const response = await axios.post(`/todo/clearall`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function sortItems() {
  try {
    const response = await axios.post(`/todo/sort`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

export {
  getItems,
  deleteItem,
  markItemAsOld,
  changeItemStatus,
  createItem,
  clearAllItems,
  sortItems
}
