// The ItemManager should go here. Remember that you have to export it.

const { Item } = require('../db/models');

const SORT_OPTIONS = ['id', 'text', 'status']

class ItemManager {
  init() {
    this.sortOptionIndex = 0;
    this.sortBy = SORT_OPTIONS[this.sortOptionIndex];
  }

  async addItem(text) {
    const newItem = await Item.create({
      "text": text,
      "isNew": true,
      "status": false,
      "done": null
    });
    console.log('newItem', newItem);
    return newItem;
  }

  async getItem(itemId) {
    return await Item.findAll({
      where: {
        id: itemId
      }
    });
  }

  async updateItem(itemId, body) {
    return await Item.update({
      text: body.text,
      isNew: body.isNew,
      status: body.status,
      done: body.done
     }, {
      where: { id: itemId }
     })
  }

  async deleteItem(itemId) {
    return await Item.destroy({
      where: { id: itemId },
    });
  }

  async clearAll() {
    return await Item.destroy({
      where: {},
      truncate: true
    });
  }

  async sortItems(){
    this.sortOptionIndex = (this.sortOptionIndex + 1) % SORT_OPTIONS.length
    return this.sortBy = SORT_OPTIONS[this.sortOptionIndex];
  }

  async getAll() {
    return await Item.findAll({
      order: [
        [this.sortBy, "ASC"],
        ['updatedAt', "ASC" ]
      ]
    });
  }
}

module.exports = ItemManager;
