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
      const response = await axios.put(`/todo/${item.id}`, {isNew: false});
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }
}
