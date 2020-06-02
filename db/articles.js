/*
 * @Author: menghui
 * @Date: 2020-03-19 22:20:14
 * @Last Modified by: menghui
 * @Last Modified time: 2020-04-12 21:49:48
 */

let mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema(
  {
    //关联字段 -内容分类的id
    category: {
      // 类型
      type: mongoose.Schema.Types.ObjectId,
      //引用
      ref: 'Category',
    },
    //分类标题
    title: String,
    //分类标题
    description: String,
    //关联字段 -用户id
    user: {
      // 类型
      type: mongoose.Schema.Types.ObjectId,
      //引用
      ref: 'User',
    },
    update_user: {
      // 类型
      type: mongoose.Schema.Types.ObjectId,
      //引用
      ref: 'User',
    },
    //添加时间
    create_time: {
      type: String,
    },
    //修改时间
    update_time: {
      type: String,
    },
    //点击量
    see_count: {
      type: Number,
      default: 0,
    },

    //内容
    content: {
      type: String,
      default: '',
    },
    //是否使用
    is_public: {
      type: Number,
      default: 1,
    },
    typearr: {
      type: Array,
    },
  },
  { versionKey: false }
);
