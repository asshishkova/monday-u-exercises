// The ItemManager should go here. Remember that you have to export it.

import { getItems, insertItems } from "../data_access/data_access.js";

const UNSORTED = Symbol("unsorted");
const SORTED_ASC = Symbol("sortedAsc");
const SORTED_DESC = Symbol("sortedDesc");

export class ItemManager {
  init() {
    this.sortOrder = UNSORTED;
    try {
      getItems();
    } catch (error) {
      insertItems([]);
    }
  }

  async addItem(text) {
    const data = await getItems();
    const itemIndex = data.findIndex(item => item.text === text);
    let newItem;
    if (itemIndex > -1) {
      data[itemIndex].isNew = true;
      newItem = data[itemIndex];
    } else {
      const currentIds = data.map(item => item.id);
      const newId = Math.max(...currentIds, 0) + 1;
      console.log('newId', newId);
      newItem = {id: newId, text: text, isNew: true};
      data.push(newItem);
    }
    await insertItems(data);
    return newItem;
  }

  async getItem(id) {
    const data = await this.getAll();
    return data.find((value) => value.id === id);
  }

  async updateItem(itemId, body) {
    const data = await this.getAll();
    const index = data.findIndex(value => {
        return value.id === itemId;
    });
    const item = data[index];
    Object.assign(item, body);
    await insertItems(data);
    return item;
  }

  async deleteItem(id) {
    const data = await this.getAll();
    const itemIndex = data.findIndex(item => item.id === id);
    const deletedTodo = data[itemIndex]
    data.splice(itemIndex, 1);
    await insertItems(data);
    return deletedTodo;
  }

  async clearAll(){
    await insertItems([]);
    return [];
  }

  async sortItems(){
    const data = await this.getAll();
    if (this.sortOrder === UNSORTED || this.sortOrder === SORTED_DESC) {
      data.sort((a, b) => a.text.localeCompare(b.text));
      this.sortOrder = SORTED_ASC;
    } else {
      data.reverse();
      this.sortOrder = SORTED_DESC;
    }
    await insertItems(data);
    return data;
  }

  async getAll() {
    return await getItems();
  }
}
