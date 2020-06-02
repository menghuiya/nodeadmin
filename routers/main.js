/**created by 梦回 */

let express = require('express');
let router = express.Router();
let User = require('../models/User');
let fs = require('fs');
/**
 * 处理通用的数据
 */

/**
 * 首页
 */

router.get('/', function (req, res, next) {
  res.render('index');
});

/**评论内容 */

module.exports = router;
