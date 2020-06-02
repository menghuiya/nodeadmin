/*
 *操作文件中的数据,只处理数据
 */
const fs = require('fs');

const jsonData = [
  './json/homedata.json',
  './json/homedata1.json',
  './json/homedata2.json',
];
//获取所有数据
function findAll(data_typeid, callback) {
  fs.readFile(jsonData[data_typeid], (err, data) => {
    callback(err, data);
  });
}
//添加数据
function add(data_typeid, body, callback) {
  fs.readFile(jsonData[data_typeid], 'utf8', (err, data) => {
    data = JSON.parse(data);

    if (data.data.length === 0) {
      data = {
        code: 200,
        msg: 'ok',
        data: [
          {
            id: 1,
            title: '壁纸1',
            img_src:
              'https://color-test.oss-cn-qingdao.aliyuncs.com/sa-admin/32.jpg',
            link: 'https://www.52mhzy.cn',
            content: '这里是内容哦,可以修改',
            is_update: false,
          },
        ],
        dataCount: 1,
      };
    }
    body['id'] = data.data[data.data.length - 1].id + 1;
    body['is_update'] = false;
    data.data.push(body);
    data['dataCount'] = data.data.length;
    fs.writeFile(jsonData[data_typeid], JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}
//编辑数据
function edit(data_typeid, id, callback) {
  fs.readFile(jsonData[data_typeid], (err, data) => {
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
//删除数据
function remove(data_typeid, id, callback) {
  console.log(jsonData[data_typeid]);
  fs.readFile(jsonData[data_typeid], (err, data) => {
    let sNum = 0;
    data = JSON.parse(data);
    data.data.forEach((e, index) => {
      //find
      if (e.id === Number(id)) {
        sNum = index;
      }
    });
    data.data.splice(sNum, 1);
    fs.writeFile(jsonData[data_typeid], JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}
function update(data_typeid, body, callback) {
  fs.readFile(jsonData[data_typeid], (err, data) => {
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
    fs.writeFile(jsonData[data_typeid], JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}
module.exports = { findAll, add, edit, remove, update };
