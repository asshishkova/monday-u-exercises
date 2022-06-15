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

  addItem(text) {
    const itemIndex = this.items.findIndex(item => item.text === text);
    if (itemIndex > -1) {
      this.items[itemIndex].isNew = true;
    } else {
      this.items.push({text: text, isNew: true });
    }
    this.writeItemsToFile();
    return this.items;
  }

  async getItem(id) {
    const data = await this.getItemsFromFile();
    return data.find((value) => value.id === id); // instead of index
    // return this.items[index];
  }

  // async getItem(id) {
  //   return await this.getItemFromFile(id);
  // }

  // async getItemFromFile(id) {
  //   const data = readFileSync(DATA_FILE_NAME);
  //   return JSON.parse(data).find((value) => value.id === id);
  // }

  markItemAsOld(item){
    item.isNew = false;
    this.writeItemsToFile();
    return this.items;
  }

  deleteItem(index) {
    this.items.splice(index, 1);
    this.writeItemsToFile();
    return this.items;
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
