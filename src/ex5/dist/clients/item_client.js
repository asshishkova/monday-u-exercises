export class ItemClient {
  async getItems() {
    try {
      const response = await axios.get("/todo");
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }

  async deleteItem(item) {
    try {
      const response = await axios.delete(`/todo/${item.id}`);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }

  async markItemAsOld(item) {
    try {
      const response = await axios.post(`/todo/${item.id}/markold`);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }

  async changeItemStatus(item) {
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

  async createItem(itemText) {
    try {
      const response = await axios.post(`/todo`, {text: itemText});
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }

  async clearAll() {
    try {
      const response = await axios.post(`/todo/clearall`);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }

  async sortItems() {
    try {
      const response = await axios.post(`/todo/sort`);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
}
