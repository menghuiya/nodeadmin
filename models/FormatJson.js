function formJson(treeAry, callback) {
  treeAry = JSON.parse(treeAry);

  let tree = [];
  function find(oneArray, id) {
    for (one of oneArray) {
      if (one._id === id) {
        return one;
      } else if (!!one.children && one.children.length > 0) {
        let findInChild = find(one.children, id);
        if (findInChild != null) {
          return findInChild;
        }
      }
    }
    return null;
  }

  function trans2Tree(tempTreeAry) {
    // let length = tempTreeAry.length;
    for (let i = 0; i < tempTreeAry.length; i++) {
      var one = tempTreeAry[i];
      // 没有parentid则为一级菜单，直接加入到树结构
      if (one.parentId == null) {
        one.children = [];
        let treeNode = one;
        tree.push(treeNode);
        tempTreeAry.splice(i, 1);
        i--;
      } else {
        // 先查找tree中是否有父节点，有则加入，没有跳过
        let parentNode = find(tree, one.parentId);
        if (parentNode != null) {
          if (!parentNode.children) {
            parentNode.children = [];
          }
          parentNode.children.push(one);
          tempTreeAry.splice(i, 1);
          i--;
        }
        // 没有找到，则什么都不做
      }
    }
    // 判断，如果这时原始数组中还有数据，则继续
    if (tempTreeAry.length > 0) {
      trans2Tree(tempTreeAry);
    }
  }
  trans2Tree(treeAry);
  function addLevel(tree, level) {
    tree.level = level.tree;
    level.tree++;
    if (Array.isArray(tree.children) && tree.children.length > 0) {
      for (let j = 0; j < tree.children.length; j++) {
        const fLevel = { tree: level.tree };
        addLevel(tree.children[j], fLevel);
      }
    }
  }
  for (let i = 0; i < tree.length; i++) {
    let level = { tree: 1 };
    addLevel(tree[i], level);
  }
  callback(tree);
}

module.exports = formJson;
