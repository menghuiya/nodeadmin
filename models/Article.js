/*
 * @Author: menghui
 * @Date: 2020-03-28 13:27:26
 * @Last Modified by: menghui
 * @Last Modified time: 2020-03-28 13:29:52
 */

let mongoose = require('mongoose');
let contentsSchema = require('../db/articles');

module.exports = mongoose.model('Article', contentsSchema);
