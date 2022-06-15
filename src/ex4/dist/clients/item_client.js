// Create an ItemClient class here.
// This is what makes requests to your express server (your own custom API!)
export class ItemClient {
  async getTodos() {
    try {
      const response = await axios.get("/todo");
      console.log(response);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }
}
