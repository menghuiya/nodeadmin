/*
 * @Author: menghui
 * @Date: 2020-03-28 13:26:34
 * @Last Modified by:   menghui
 * @Last Modified time: 2020-03-28 13:26:34
 */
let mongoose = require('mongoose');
let usersSchema = require('../db/users');

module.exports = mongoose.model('User', usersSchema);
