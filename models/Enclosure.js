/*
 *操作文件中的数据,只处理数据
 */
const fs = require('fs');
//获取所有附件
function findAll(tag, callback) {
  fs.readFile('./json/enclosure.json', (err, data) => {
    let o_data = JSON.parse(data);
    let o_datarr = o_data.data;
    let n_datarr = [];
    if (tag) {
      for (let item of o_datarr) {
        if (item.tag == tag) {
          n_datarr.push(item);
        }
      }
      o_data.data = n_datarr;
      callback(err, o_data);
    } else {
      callback(err, o_data);
    }
  });
}
//添加附件
function add(body, callback) {
  fs.readFile('./json/enclosure.json', (err, data) => {
    data = JSON.parse(data);
    if (data.data.length === 0) {
      body['id'] = 1;
    } else {
      body['id'] = data.data[data.data.length - 1].id + 1;
    }

    data.data.push(body);
    fs.writeFile(
      './json/enclosure.json',
      JSON.stringify(data),
      'utf8',
      (err) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      }
    );
  });
}
//编辑附件
function edit(id, callback) {
  fs.readFile('./json/enclosure.json', (err, data) => {
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
//删除附件
function remove(id, callback) {
  fs.readFile('./json/enclosure.json', (err, data) => {
    let sNum = 0;
    data = JSON.parse(data);
    data.data.forEach((e, index) => {
      //find
      if (e.id === Number(id)) {
        sNum = index;
      }
    });
    data.data.splice(sNum, 1);
    fs.writeFile(
      './json/enclosure.json',
      JSON.stringify(data),
      'utf8',
      (err) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      }
    );
  });
}
function update(body, callback) {
  fs.readFile('./json/enclosure.json', (err, data) => {
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
    fs.writeFile(
      './json/enclosure.json',
      JSON.stringify(data),
      'utf8',
      (err) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      }
    );
  });
}
module.exports = { findAll, add, edit, remove, update };
