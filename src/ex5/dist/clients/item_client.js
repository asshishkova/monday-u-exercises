// Create an ItemClient class here.

const { builtinModules } = require("module");
axios = require("axios");

// This is what makes requests to your express server (your own custom API!)
class ItemClient {
  async getItems() {
    try {
      const response = await axios.get("/todo");
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async deleteItem(item) {
    try {
      const response = await axios.delete(`/todo/${item.id}`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async markItemAsOld(item) {
    try {
      const response = await axios.patch(
        `/todo/${item.id}`,
        {text: item.text, isNew: false, status: item.status}
      );
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async changeItemStatus(item) {
    const doneTime = item.done === null? Date.now() : null;
    try {
      const response = await axios.patch(
        `/todo/${item.id}`,
        {
          text: item.text,
          isNew: item.isNew,
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

  async createItem(itemText) {
    try {
      const response = await axios.post(`/todo`, {text: itemText});
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async clearAll() {
    try {
      const response = await axios.post(`/todo/clearall`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async sortItems() {
    try {
      const response = await axios.post(`/todo/sort`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }
}

module.exports = ItemClient;
