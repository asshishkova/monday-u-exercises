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

  // async markItemAsOld(item) {
  //   try {
  //     const response = await axios.patch(`/todo/${item.id}`, {isNew: false});
  //     return response.data;
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // }

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

// class ItemClient {
//     getItems = async () => {
//         const response = await fetch('/items')
//         const todos = await response.json()

//         return todos
//     }

//     postItem = async item => {
//         await fetch('/item', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ item })
//         })
//     }

//     deleteItem = async item => {
//         await fetch('/item', {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ item })
//         })
//     }
// }
