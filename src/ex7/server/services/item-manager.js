const { Item } = require('../db/models');

class ItemManager {
  async addItem(text) {
    try {
      return await Item.create({
        text: text,
        isNew: true,
        status: false,
        done: null
      });
    } catch (error) {
      return await Item.update({
        isNew: true,
      }, {
        where: { text: text }
      })
    }
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

  async markTodoAsOld(itemId) {
    return await Item.update({
      isNew: false,
    }, {
      where: { id: itemId }
    })
  }

  async changeTodoStatus(itemId, body) {
    return await Item.update({
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

  async getAll() {
    return await Item.findAll();
  }

  async getAllPending() {
    return await Item.findAll({ where: {status: false}});
  }

  async getAllDone() {
    return await Item.findAll({ where: {status: true}});
  }
}

module.exports = ItemManager;
