// The ItemManager should go here. Remember that you have to export it.

import { writeFile, readFileSync } from 'fs';

const DATA_FILE_NAME = "savedData.json";

export class ItemManager {
  init() {
    try {
      this.items = this.getItemsFromFile();
    } catch (error) {
      this.items = [];
      this.writeItemsToFile();
    }
    return this.items;
  }

  async addItem(req) {
    // const data = await this.getItemsFromFile();
    const itemIndex = this.items.findIndex(item => item.text === req.text);
    if (itemIndex > -1) {
      this.items[itemIndex].isNew = true;
    } else {
      this.items.push({id: req.id, text: req.text, isNew: true});
    }
    this.writeItemsToFile();
    return this.items;
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

  deleteItem(id) {
    const data = await this.getAll();
    const itemIndex = data.findIndex(item => item.id === id);
    const deletedTodo = data[index]
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

  writeItemsToFile(){
    writeFile(DATA_FILE_NAME, JSON.stringify(this.items, null, 2), err => {
      if (err) throw err;
    });
  }
}
