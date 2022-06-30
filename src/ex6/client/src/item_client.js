import axios from "axios";

const SERVER_URL = "http://localhost:8080";

async function getItems() {
  try {
    const response = await axios.get(`${SERVER_URL}/todo`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function deleteItem(item) {
  try {
    const response = await axios.delete(`${SERVER_URL}/todo/${item.id}`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function markItemAsOld(item) {
  try {
    const response = await axios.post(`${SERVER_URL}/todo/${item.id}/markold`);
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
      `${SERVER_URL}/todo/${item.id}/changestatus`,
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
    const response = await axios.post(`${SERVER_URL}/todo`, {text: itemText});
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function clearAllItems() {
  try {
    const response = await axios.post(`${SERVER_URL}/todo/clearall`);
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

async function sortItems() {
  try {
    const response = await axios.post(`${SERVER_URL}/todo/sort`);
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
