// The ItemManager should go here. Remember that you have to export it.

import { promises as fs } from 'fs';


const DATA_FILE_NAME = "savedData.json";

export class ItemManager {
  init() {
    try {
      const data = this.getItemsFromFile();
    } catch (error) {
      this.writeItemsToFile([]);
    }
    return this.items;
  }

  async addItem(text) {
    const data = await this.getItemsFromFile();
    const itemIndex = data.findIndex(item => item.text === text);
    let newItem;
    if (itemIndex > -1) {
      data[itemIndex].isNew = true;
      newItem = data[itemIndex];
    } else {
      const newId = data.reduce((maxId, data) => maxId = maxId > data.id ? acc : data.id, 0) + 1;
      newItem = {id: newId, text: text, isNew: true};
      data.push(newItem);
    }
    console.log('newItem: ', newItem);
    this.writeItemsToFile(data);
    return newItem;
  }

  async getItem(id) {
    const data = await this.getAll();
    return data.find((value) => value.id === id);
  }

  async  updateItem(itemId, body) {
    const data = await this.getAll();
    const index = data.findIndex(value => {
        return value.id === itemId;
    });
    const item = data[index];
    Object.assign(item, body);
    await this.writeItemsToFile(data);
    return item;
  }

  async deleteItem(id) {
    const data = await this.getAll();
    const itemIndex = data.findIndex(item => item.id === id);
    const deletedTodo = data[itemIndex]
    data.splice(itemIndex, 1);
    await this.writeItemsToFile(data);
    return deletedTodo;
  }

  clearAllItems() {
    this.items = [];
    this.writeItemsToFile();
    return this.items;
  }

  sortItems(){
    this.items.sort((a, b) => a.text.localeCompare(b.text));
    this.writeItemsToFile();
    return this.items;
  }

  async getAll() {
    return await this.getItemsFromFile();
  }

  async getItemsFromFile(){
    const data = await fs.readFile(DATA_FILE_NAME);
    return JSON.parse(data);
  }

  async writeItemsToFile(data){
    await fs.writeFile(DATA_FILE_NAME, JSON.stringify(data, null, 2), err => {
      if (err) throw err;
    });
  }
}
