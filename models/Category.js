/*
 * @Author: menghui
 * @Date: 2020-03-28 13:27:04
 * @Last Modified by: menghui
 * @Last Modified time: 2020-03-28 13:29:48
 */

let mongoose = require('mongoose');
let categoriesSchema = require('../db/categories');

module.exports = mongoose.model('Category', categoriesSchema);
