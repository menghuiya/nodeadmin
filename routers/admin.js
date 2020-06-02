/**created by 梦回 */
let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Category = require('../models/Category');
let Article = require('../models/Article');
let Star = require('../models/Star');
let Loop = require('../models/Loop');
let Tese = require('../models/Tese');
let Enclosure = require('../models/Enclosure');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GetJson = require('../models/GetJson');
//引入加密模块
const crypto = require('../models/Encryption');
let Admin = {};

router.use(function (req, res, next) {
  if (!req.session.user) {
    //如果当前用户是非管理员
    res.render('admin/login.html');
    return;
  } else {
    if (req.session.user.isAdmin) {
      Admin.verify = true;
    } else {
      Admin.verify = false;
    }
  }

  next();
});

router.get('/', function (req, res, next) {
  res.render('admin/index', {
    userInfo: req.session.user,
  });
});
/**
 * 用户管理
 * */
/**
 * 用户增加
 */
router.post('/sa-html/user/user-add', function (req, res) {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  let username = req.body.username || '',
    password = req.body.password,
    role = req.body.role,
    sex = req.body.sex;
  password = crypto.md5(password);
  if (username == '') {
    res.json({
      code: 500,
      msg: '请输入用户名',
    });
    return;
  }
  sex = sex == 1 ? '男' : '女';
  //判断数据库中是否已经存在同名用户
  User.findOne({
    username: username,
  })
    .then(function (rs) {
      if (rs) {
        //数据库中已经存在该分类了
        res.json({
          code: 500,
          msg: '该用户已存在',
        });
        return Promise.reject();
      } else {
        //表示数据库中是不存在该用户 可以保存
        return User({
          username: username,
          password: password,
          role: role,
          sex: sex,
        }).save();
      }
    })
    .then(function (newUser) {
      res.json({
        code: 200,
        msg: '添加成功',
      });
    });
});
/**用户修改 */
router.get('/sa-html/user/user-edit', function (req, res) {
  //获取需要修改的分类的信息,并且使用表单的形式展现
  let id = req.query.user_id || '';
  //获取修改的分类信息
  User.findOne({
    _id: id,
  }).then(function (user) {
    if (!user) {
      res.json({
        code: 500,
        msg: '该用户不存在',
      });
      return Promise.reject();
    } else {
      user.sex = user.sex == '男' ? 1 : 2;
      // console.log(user);
      res.render('admin/sa-html/user/user-edit.html', {
        code: 200,
        msg: 'ok',
        data: user,
      });
    }
  });
});
/**用户修改后保存 */
router.post('/sa-html/user/user-edit', function (req, res) {
  let id = req.body._id || '',
    //获取post提交过来的名称
    name = req.body.username || '',
    password = req.body.password,
    role = req.body.role,
    sex = req.body.sex;
  password = crypto.md5(password);
  sex = sex == 1 ? '男' : '女';
  //获取修改的用户信息
  User.findOne({
    _id: id,
  })
    .then(function (user) {
      if (!user) {
        res.json({
          code: 500,
          msg: '该用户不存在',
        });
        return Promise.reject();
      } else {
        //当用户没有做任何的修改提交的时候
        if (
          name == user.username &&
          password == user.password &&
          role == user.role &&
          sex == user.sex
        ) {
          res.json({
            code: 200,
            msg: '添加成功,但并未做任何修改',
          });
          return Promise.reject();
        } else {
          //要修改的用户数据 是否已经在数据库中存在
          return User.findOne({
            _id: { $ne: id },
            username: name,
          });
        }
      }
    })
    .then(function (sameUser) {
      if (sameUser) {
        res.json({
          code: 200,
          msg: '数据库中已有同名存在,所以未做更改',
        });
        return Promise.reject();
      } else {
        return User.update(
          {
            _id: id,
          },
          {
            username: name,
            password: password,
            role: role,
            sex: sex,
          }
        );
      }
    })
    .then(function () {
      res.json({
        code: 200,
        msg: '用户信息更新成功',
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**用户删除 */

router.get('/sa-html/user/user-delete', function (req, res) {
  //获取要删除的分类id
  let id = req.query.user_id || '';
  User.findOne({
    _id: id,
  })
    .then(function (userInfo) {
      if (userInfo.isAdmin) {
        res.json({
          code: 200,
          msg: '该用户是管理员,无法更改',
        });
        return Promise.reject();
      }
    })
    .then(function () {
      User.remove({
        _id: id,
      }).then(function () {
        res.json({
          code: 200,
          msg: '删除用户成功',
        });
      });
    })
    .catch((error) => {
      console.log('error: ' + error);
    });
});

/**用户状态接口 */
router.post('/users_statu', function (req, res) {
  let id = req.query.user_id || '';
  let status = req.body.status;
  User.findOne({
    _id: id,
  })
    .then(function (userInfo) {
      if (userInfo.isAdmin) {
        res.json({
          code: 200,
          msg: '该管理员用户无法修改状态',
        });
        return Promise.reject();
      }
    })
    .then(function () {
      User.update(
        { _id: id },
        {
          status: status,
        }
      ).then(function () {
        if (status == 1) {
          res.json({
            code: 200,
            msg: '用户已启用',
          });
        } else {
          res.json({
            code: 200,
            msg: '用户已禁用',
          });
        }
      });
    })
    .catch((error) => {
      console.log('error: ' + error);
    });
});
/**
 * 分类管理首页+分类增加
 *
 */

/**内容首页 */
router.get('/sa-html/article/art-list', (req, res) => {
  res.render('admin/sa-html/article/art-list.html', {
    userInfo: req.session.user,
  });
});
router.get('/sa-html/article/art-add', (req, res) => {
  res.render('admin/sa-html/article/art-add.html', {
    userInfo: req.session.user,
  });
});
/**
 * 内容添加页面 由于限制问题 暂且给一个分类文章接口
 */
// router.get('/sa-html/article/art-add-cate', (req, res) => {
//   Category.find(
//     {},
//     //限制查询字段 忽略userID
//     {
//       name: 1,
//     }
//   )
//     .sort({ _id: -1 })
//     .then(function (categories) {
//       // console.log(categories);
//       res.json({
//         code: 200,
//         msg: 'ok',
//         categories: categories,
//       });
//     });
// });

/**
 * 内容保存
 */
router.post('/sa-html/article/art-add', function (req, res) {
  //验证
  let type = req.body.type;
  let type_id;
  if (type.length < 0) {
    res.json({
      code: 500,
      msg: '需要您选择一个分类',
    });
    return;
  } else {
    type_id = type[type.length - 1];
  }
  if (req.body.title == '') {
    res.json({
      code: 500,
      msg: '标题不能为空',
    });
    return;
  }
  if (req.body.content == '') {
    res.json({
      code: 500,
      msg: '内容不能为空',
    });
    return;
  }
  //保存数据到数据库
  // console.log(Date.now());
  new Article({
    category: type_id,
    title: req.body.title,
    user: req.session.user._id,
    update_user: req.session.user._id,
    description: req.body.description,
    content: req.body.content,
    is_public: req.body.is_public,
    create_time: Date.now(),
    update_time: Date.now(),
    typearr: type,
  })
    .save()
    .then(function (rs) {
      res.json({
        code: 200,
        msg: '文章发表成功',
      });
    });
});

/**
 * 内容的修改
 */
router.get('/sa-html/article/art-edit', function (req, res) {
  //获取文章_id
  let id = req.query.art_id || '';
  Article.findOne({
    _id: id,
  }).then(function (Article) {
    if (!Article) {
      res.json({
        code: 500,
        msg: '该文章不存在',
      });
      return Promise.reject();
    } else {
      res.render('admin/sa-html/article/art-add.html', {
        code: 200,
        userInfo: req.session.user,
        article: Article,
      });
    }
  });
  //获取post提交过来的名称
});
/**保存修改 */
router.post('/sa-html/article/art-edit', function (req, res) {
  let id = req.body.art_id || '';
  let type = req.body.type;
  let type_id;
  if (type.length < 0) {
    res.json({
      code: 500,
      msg: '需要您选择一个分类',
    });
    return;
  } else {
    type_id = type[type.length - 1];
  }
  //验证
  if (req.body.type_id == 0) {
    res.json({
      code: 500,
      msg: '需要您选择一个分类',
    });
    return;
  }
  if (req.body.title == '') {
    res.json({
      code: 500,
      msg: '标题不能为空',
    });
    return;
  }
  if (req.body.content == '') {
    res.json({
      code: 500,
      msg: '内容不能为空',
    });
    return;
  }

  Article.update(
    {
      _id: id,
    },
    {
      category: type_id,
      title: req.body.title,
      //以后加一个最后修改字段 以及文章描述字段
      update_user: req.session.user._id,
      description: req.body.description,
      content: req.body.content,
      is_public: req.body.is_public,
      update_time: Date.now(),
      typearr: type,
    }
  ).then(function () {
    res.json({
      code: 200,
      msg: '文章修改成功',
    });
  });
});

/**内容删除 */
router.get('/sa-html/article/art-delete', function (req, res) {
  //获取要删除的分类id
  let id = req.query.art_id || '';
  Article.remove({
    _id: id,
  }).then(function () {
    res.json({
      code: 200,
      msg: '文章删除成功',
    });
  });
});

router.get('/login', (req, res) => {
  res.render('admin/login.html');
});
router.get('/main', (req, res) => {
  res.render('admin/main.html');
});
router.get('/sa-html/home/list', (req, res) => {
  res.render('admin/sa-html/home/swiper-list.html');
});
router.get('/sa-html/home/tese', (req, res) => {
  res.render('admin/sa-html/home/tese.html');
});
router.get('/sa-html/home/chengguo', (req, res) => {
  res.render('admin/sa-html/home/chengguo.html');
});
router.get('/sa-html/home/chengguo2', (req, res) => {
  res.render('admin/sa-html/home/chengguo2.html');
});
//用户
router.get('/sa-html/user/user-list', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  res.render('admin/sa-html/user/user-list.html');
});
router.get('/sa-html/user/user-add', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  res.render('admin/sa-html/user/user-add.html');
});

// 错误页面;
router.get('/sa-html/error-page/403', (req, res) => {
  res.render('admin/sa-html/error-page/403.html');
});
router.get('/sa-html/error-page/404', (req, res) => {
  res.render('admin/sa-html/error-page/404.html');
});
router.get('/sa-html/error-page/500', (req, res) => {
  res.render('admin/sa-html/error-page/500.html');
});
router.get('/sa-html/cfg/system-cfg', (req, res) => {
  res.render('admin/sa-html/cfg/system-cfg.html');
});

//明星用户
router.get('/sa-html/star/list', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  res.render('admin/sa-html/star/list.html');
});
router.get('/sa-html/star/add', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  let id = Number(req.query.id);
  if (id) {
    Star.edit(Number(req.query.id), (data) => {
      console.log(data);
      res.render('admin/sa-html/star/add.html', { data: data });
    });
  } else {
    res.render('admin/sa-html/star/add.html');
  }
});

// 文章分类页面;
router.get('/sa-html/category/cate-list', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  res.render('admin/sa-html/category/cate-list.html');
});
router.get('/sa-html/category/cate-add', (req, res) => {
  let cate_id = req.query.cate_id || '';
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  } else if (cate_id) {
    res.render('admin/sa-html/category/cate-add.html', {
      parentId: cate_id,
      msg: '增加子栏目',
    });
  } else {
    res.render('admin/sa-html/category/cate-add.html', {
      msg: '增加一级分类',
    });
  }
});
//分类增加
router.post('/sa-html/category/cate-add', function (req, res) {
  let name = req.body.name || '';
  let parentId = req.body.parentId || '';
  let datas = {
    name: name,
  };
  if (parentId) {
    datas.parentId = parentId;
  }
  if (name == '') {
    res.json({
      code: 500,
      msg: '分类名不能为空',
    });
    return;
  }
  //判断数据库中是否已经存在同名分类
  Category.findOne({
    name: name,
  })
    .then(function (rs) {
      if (rs) {
        //数据库中已经存在该分类了
        res.json({
          code: 500,
          msg: '已经存在该分类',
        });
        return Promise.reject();
      } else {
        //表示数据库中是不存在该分类 可以保存
        return Category(datas).save();
      }
    })
    .then(function (newCategory) {
      res.json({
        code: 200,
        msg: '保存分类成功',
      });
    });
});

/**分类修改 */
router.get('/sa-html/category/cate-edit', function (req, res) {
  //获取需要修改的分类的信息,并且使用表单的形式展现
  let id = req.query.cate_id || '';
  //获取修改的分类信息
  Category.findOne({
    _id: id,
  }).then(function (category) {
    // console.log(category);
    if (!category) {
      res.json({
        code: 500,
        msg: '分类不存在111',
      });
      return Promise.reject();
    } else {
      res.render('admin/sa-html/category/cate-add.html', {
        userInfo: req.session.user,
        category: category,
      });
    }
  });
});

/**分类修改保存 */
router.post('/sa-html/category/cate-edit', function (req, res) {
  let id = req.body.cate_id || '';
  //获取post提交过来的名称
  let name = req.body.name || '';
  //获取修改的分类信息
  Category.findOne({
    _id: id,
  })
    .then(function (category) {
      if (!category) {
        res.json({
          code: 500,
          msg: '分类不存在',
        });
        return Promise.reject();
      } else {
        //当用户没有做任何的修改提交的时候
        if (name == category.name) {
          res.json({
            code: 200,
            msg: '分类修改成功,但并未做任何修改',
          });
          return Promise.reject();
        } else {
          //要修改的分类名称 是否已经在数据库中存在
          return Category.findOne({
            _id: { $ne: id },
            name: name,
          });
        }
      }
    })
    .then(function (sameCategory) {
      if (sameCategory) {
        res.json({
          code: 500,
          msg: '数据库已存在相同分类,请更改',
        });
        return Promise.reject();
      } else {
        return Category.update(
          {
            _id: id,
          },
          {
            name: name,
          }
        );
      }
    })
    .then(function () {
      res.json({
        code: 200,
        msg: '分类修改成功',
      });
    });
});

/**分类删除 */

router.get('/sa-html/category/cate-delete', function (req, res) {
  //获取要删除的分类id
  let id = req.query.cate_id || '';
  Category.findOne({
    parentId: id,
  })
    .then(function (category) {
      if (category) {
        res.json({
          code: 500,
          msg: '请先删除该栏目下的子栏目',
        });
        return Promise.reject('有子栏目');
      }
    })
    .then(function () {
      Category.remove({
        _id: id,
      }).then(function () {
        res.json({
          code: 200,
          msg: '分类删除成功',
        });
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

/**明星用户操作 */
router.post('/staradd', (req, res) => {
  let data = req.body;
  Star.add(data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '添加成功' });
    } else {
      return res.json({ code: 500, msg: '添加失败' });
    }
  });
});
router.post('/staredit', (req, res) => {
  // console.log(req.body);
  let data = req.body;
  Star.update(data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '修改成功' });
    } else {
      return res.json({ code: 500, msg: '修改失败' });
    }
  });
});

router.get('/stardel', (req, res) => {
  Star.remove(req.query.id, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '删除成功' });
    } else {
      return res.json({ code: 500, msg: '删除失败' });
    }
  });
});

/**轮播图操作 */
router.post('/loopadd', (req, res) => {
  let data = req.body;

  Loop.add(data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '添加成功' });
    } else {
      return res.json({ code: 500, msg: '添加失败' });
    }
  });
});
router.post('/loopedit', (req, res) => {
  // console.log(req.body);
  let data = req.body;
  data.status = Number(data.status);
  data.is_update = false;
  Loop.update(data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '修改成功' });
    } else {
      return res.json({ code: 500, msg: '修改失败' });
    }
  });
});

router.post('/loopdel', (req, res) => {
  Loop.remove(req.query.id, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '删除成功' });
    } else {
      return res.json({ code: 500, msg: '删除失败' });
    }
  });
});

//文件上传

let storage = multer.diskStorage({
  //确定图片存储的位置
  destination: function (req, file, cb) {
    cb(null, './public/uploadImgs');
  },
  //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
  filename: function (req, file, cb) {
    cb(null, 'upload_' + Date.now() + path.extname(file.originalname));
  },
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
let upload = multer({ storage: storage });
//接收上传图片请求的接口
router.post('/upload', upload.single('file'), function (req, res, next) {
  //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
  //线上的也就是服务器中的图片的绝对地址
  let domin = req.protocol + '://' + req.get('host');
  let url = domin + '/public/uploadImgs/' + req.file.filename;
  res.json({
    code: 200,
    // isOk: true,
    data: url,
  });
});

//首页各种操作接口
/**轮播图操作 */
router.post('/teseadd', (req, res) => {
  let data = req.body;
  let data_typeid = req.query.type_id || 0;
  Tese.add(data_typeid, data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '添加成功' });
    } else {
      return res.json({ code: 500, msg: '添加失败' });
    }
  });
});
router.post('/teseedit', (req, res) => {
  // console.log(req.body);
  let data_typeid = req.query.type_id || 0;
  let data = req.body;
  data.status = Number(data.status);
  data.is_update = false;
  Tese.update(data_typeid, data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '修改成功' });
    } else {
      return res.json({ code: 500, msg: '修改失败' });
    }
  });
});

router.post('/tesedel', (req, res) => {
  let data_typeid = req.query.type_id || 0;
  Tese.remove(data_typeid, req.query.id, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '删除成功' });
    } else {
      return res.json({ code: 500, msg: '删除失败' });
    }
  });
});

/**获取json文件并且发送给前端 */
router.get('/sa-html/jsondata/list', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  res.render('admin/sa-html/jsondata/list.html');
});
router.get('/sa-html/jsondata/add', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  let name = req.query.name || '';
  if (name) {
    GetJson.getJsonData(name, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let jsondata = {
        data: JSON.parse(data),
        textname: name,
      };

      res.render('admin/sa-html/jsondata/add.html', {
        jsondata: jsondata,
      });
    });
  } else {
    res.render('admin/sa-html/jsondata/add.html');
  }
});

router.post('/jsonadd', (req, res) => {
  fs.writeFile('./jsondata/' + req.body.name, req.body.content, function (err) {
    if (err) {
      res.json({
        code: 500,
        msg: '保存失败',
      });
      return;
    }
    res.json({
      code: 200,
      msg: 'ok',
    });
  });
});
/**修改json文件后保存 */
router.post('/jsonedit', (req, res) => {
  fs.writeFile('./jsondata/' + req.body.name, req.body.content, function (err) {
    if (err) {
      res.json({
        code: 500,
        msg: '修改失败',
      });
      return;
    }
    res.json({
      code: 200,
      msg: 'ok',
    });
  });
});
/**删除json文件 */
router.post('/jsondel', (req, res) => {
  let name = req.query.name;
  fs.unlink('./jsondata/' + name, function (err) {
    if (err) {
      res.json({
        code: 500,
        msg: '删除失败',
      });
      return;
    }
    res.json({
      code: 200,
      msg: 'ok',
    });
  });
});

/**系统日志部分   */

router.get('/enclosure/list', (req, res) => {
  if (!Admin.verify) {
    res.render('admin/sa-html/error-page/403.html');
    return;
  }
  res.render('admin/sa-html/enclosure/list.html');
});

//附件保存
let ensstorage = multer.diskStorage({
  //确定图片存储的位置
  destination: function (req, file, cb) {
    cb(null, './public/upload');
  },
  //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_mh_' + file.originalname);
  },
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
let ensupload = multer({ storage: ensstorage });
//接收上传图片请求的接口
router.post('/ensupload', ensupload.single('file'), function (req, res, next) {
  //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
  //线上的也就是服务器中的图片的绝对地址
  let domin = req.protocol + '://' + req.get('host');
  let url = domin + '/public/upload/' + req.file.filename;
  res.json({
    code: 200,
    // isOk: true,
    data: {
      name: req.file.filename,
      url: url,
    },
  });
});
router.post('/ensadd', (req, res) => {
  let data = req.body;
  Enclosure.add(data, (err) => {
    if (err === null) {
      return res.json({ code: 200, msg: '添加成功' });
    } else {
      return res.json({ code: 500, msg: '添加失败' });
    }
  });
});

router.post('/ensdel', (req, res) => {
  let url = req.query.url;
  let name = url.split('/');
  let file_name = name[name.length - 1];
  const promise = new Promise(function (resolve, reject) {
    fs.unlink('./public/upload/' + file_name, function (err) {
      if (err) {
        reject({
          code: 500,
          msg: '删除失败',
        });
      }
      resolve();
    });
  });
  promise
    .then(() => {
      Enclosure.remove(req.query.id, (err) => {
        if (err === null) {
          return res.json({ code: 200, msg: '删除成功' });
        } else {
          return res.json({ code: 500, msg: '删除失败' });
        }
      });
    })
    .catch((err) => {
      res.json(err);
    });
});
// router.get('/stardel', (req, res) => {
//   Star.remove(req.query.id, (err) => {
//     if (err === null) {
//       return res.json({ code: 200, msg: '删除成功' });
//     } else {
//       return res.json({ code: 500, msg: '删除失败' });
//     }
//   });
// });

module.exports = router;
