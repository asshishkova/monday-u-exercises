// The ItemManager should go here. Remember that you have to export it.

import { writeFile, readFileSync } from 'fs';

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

  async addItem(req) {
    const data = await this.getItemsFromFile();
    const itemIndex = data.findIndex(item => item.text === req.text);
    if (itemIndex > -1) {
      data[itemIndex].isNew = true;
    } else {
      data.push({id: req.id, text: req.text, isNew: true});
    }
    this.writeItemsToFile(data);
    return data;
  }

  async getItem(id) {
    const data = await this.getAll();
    return data.find((value) => value.id === id);
  }

  markItemAsOld(item){
    item.isNew = false;
    this.writeItemsToFile();
    return this.items;
  }

  async deleteItem(id) {
    const data = await this.getAll();
    const itemIndex = data.findIndex(item => item.id === id);
    const deletedTodo = data[itemIndex]
    data.splice(index, 1);
    await writeItemsToFile(data);
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

  getItemsFromFile(){
    const data = readFileSync(DATA_FILE_NAME);
    return JSON.parse(data);
  }

  writeItemsToFile(data){
    writeFile(DATA_FILE_NAME, JSON.stringify(data, null, 2), err => {
      if (err) throw err;
    });
  }
}
