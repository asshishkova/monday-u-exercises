// Create an ItemClient class here.
// This is what makes requests to your express server (your own custom API!)
export class ItemClient {
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
      const response = await axios.post(`/todo/${item.id}/markold`);
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
      const response = await axios.delete(`/todo`);
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
