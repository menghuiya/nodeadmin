/*
 * @Author: menghui
 * @Date: 2020-03-18 21:48:34
 * @Last Modified by: menghui
 * @Last Modified time: 2020-04-12 21:49:39
 */
let mongoose = require('mongoose');

//一级分类的表结构
module.exports = new mongoose.Schema(
  {
    //分类名
    name: String,
    user: {
      type: String,
      default: '梦回',
    },
    sort: {
      type: Number,
      default: 1,
    },
    parentId: mongoose.Schema.Types.ObjectId,
    create_time: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);
