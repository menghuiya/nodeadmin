/*
 *操作文件中的数据,只处理数据
 */
const fs = require('fs');
//获取所有学生
function findAll(callback) {
  fs.readFile('./json/star.json', (err, data) => {
    callback(err, data);
  });
}
//添加学生
function add(body, callback) {
  fs.readFile('./json/star.json', (err, data) => {
    data = JSON.parse(data);
    if (data.data.length === 0) {
      data = {
        code: 200,
        msg: 'ok',
        data: [
          {
            id: 1000,
            name: 'zhangfei',
            role: '学生',
            age: 18,
            content: '并没有简介',
            create_time: 1586092632103,
          },
        ],
      };
    }
    body['id'] = data.data[data.data.length - 1].id + 1;
    body['create_time'] = Date.now();
    data.data.push(body);
    fs.writeFile('./json/star.json', JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}
//编辑学生
function edit(id, callback) {
  fs.readFile('./json/star.json', (err, data) => {
    let sNum;
    data = JSON.parse(data);
    data.data.forEach((e, index) => {
      if (e.id === id) {
        sNum = index;
      }
    });
    callback(data.data[sNum]);
  });
}
//删除学生
function remove(id, callback) {
  fs.readFile('./json/star.json', (err, data) => {
    let sNum = 0;
    data = JSON.parse(data);
    data.data.forEach((e, index) => {
      //find
      if (e.id === Number(id)) {
        sNum = index;
      }
    });
    data.data.splice(sNum, 1);
    fs.writeFile('./json/star.json', JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}
function update(body, callback) {
  fs.readFile('./json/star.json', (err, data) => {
    let sNum;
    data = JSON.parse(data);
    body.id = Number(body.id);
    body['create_time'] = Date.now();
    data.data.forEach((e, index) => {
      //fundIndex
      if (e.id === body.id) {
        sNum = index;
      }
    });
    data.data.splice(sNum, 1, body);
    fs.writeFile('./json/star.json', JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}
module.exports = { findAll, add, edit, remove, update };
