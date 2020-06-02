const fs = require('fs');
const join = require('path').join;
function getJsonFiles(jsonPath, callback) {
  let jsonFiles = [];
  let id = 1;
  function findJsonFile(path) {
    let files = fs.readdirSync(path);
    files.forEach(function (item, index) {
      let fPath = join(path, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        fPath = fPath.split('\\')[1];
        data = {
          id: id++,
          name: fPath,
        };

        jsonFiles.push(data);
      }
    });
  }
  findJsonFile(jsonPath);
  // console.log(jsonFiles);
  callback(jsonFiles);
}

function getJsonData(name, callback) {
  fs.readFile('./jsondata/' + name, 'utf-8', (err, data) => {
    callback(err, data);
  });
}

function getEnsFiles(jsonPath, domin, callback) {
  let jsonFiles = [];
  let id = 1;
  function findJsonFile(path) {
    let files = fs.readdirSync(path);
    files.forEach(function (item, index) {
      let fPath = join(path, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        fPath = fPath.split('\\')[2];
        let url = domin + fPath;
        let name = fPath.split('_mh_')[1];
        data = {
          id: id++,
          name: name,
          url: url,
        };

        jsonFiles.unshift(data);
      }
    });
  }
  findJsonFile(jsonPath);
  // console.log(jsonFiles);
  callback(jsonFiles);
}

module.exports = { getJsonFiles, getJsonData, getEnsFiles };
