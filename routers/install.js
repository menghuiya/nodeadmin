/**created by 梦回 */

let express = require('express');
let router = express.Router();
let User = require('../models/User');
let fs = require('fs');
//引入加密模块
const crypto = require('../models/Encryption');
/**
 * 处理通用的数据
 */

/**
 * 安装页面
 */
router.get('/', function (req, res, next) {
  fs.exists('install.block.txt', function (exists) {
    if (!exists) {
      res.render('install');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html;l;charset=utf-8' });
      res.end(
        `<h2>检测到您已安装,请 <a href="/admin">点击此处</a>进入后台</h2> 
        <h3>倘若需要重新安装,请删除根目录下:<span style="color:red;">install.block.txt</span>文件</h3>`
      );
    }
  });
});
router.post('/', function (req, res, next) {
  User.create({
    username: req.body.count,
    password: crypto.md5(req.body.pass),
    role: '管理员',
    sex: '男',
    isAdmin: true,
  }).then((data) => {
    if (data) {
      fs.writeFile('install.block.txt', '已经安装', function (err) {
        if (err) {
          return console.error(err);
        }
        res.json({
          code: 200,
          msg: 'ok',
        });
      });
    } else {
      res.json({
        code: 500,
        msg: '增加失败',
      });
    }
  });
});

/**评论内容 */

module.exports = router;
