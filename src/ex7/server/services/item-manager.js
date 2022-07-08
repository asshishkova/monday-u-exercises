const { Item } = require('../db/models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

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
      await Item.update({
        isNew: true,
      }, {
        where: { text: text }
      })
      return await Item.findOne({
        where: {text: text}
      })
    }
  }

  async restoreItem(text, status, done) {
    try {
      return await Item.create({
        text: text,
        isNew: true,
        status: status,
        done: done
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

  async getAllWhere(text) {
    return await Item.findAll({ where: { text: { [Op.like]: `%${text}%` } }});
  }
}

module.exports = ItemManager;
