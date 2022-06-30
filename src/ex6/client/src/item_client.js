import axios from "axios";

const SERVER_URL = "http://localhost:8080";

export class ItemClient {
  async getItems() {
    try {
      const response = await axios.get(`${SERVER_URL}/todo`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async deleteItem(item) {
    try {
      const response = await axios.delete(`${SERVER_URL}/todo/${item.id}`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async markItemAsOld(item) {
    try {
      const response = await axios.post(`${SERVER_URL}/todo/${item.id}/markold`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async changeItemStatus(item) {
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

  async createItem(itemText) {
    try {
      const response = await axios.post(`${SERVER_URL}/todo`, {text: itemText});
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async clearAll() {
    try {
      const response = await axios.post(`${SERVER_URL}/todo/clearall`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async sortItems() {
    try {
      const response = await axios.post(`${SERVER_URL}/todo/sort`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }
}