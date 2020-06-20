/**created by 梦回 */

let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Category = require('../models/Category');
let Article = require('../models/Article');
// let mongoose = require('mongoose');
let Star = require('../models/Star');
let Loop = require('../models/Loop');
let Tese = require('../models/Tese');
const GetJson = require('../models/GetJson');
let Enclosure = require('../models/Enclosure');

//引入加密模块
const crypto = require('../models/Encryption');

// router.get('/user', function(req, res, next) {
//   res.send('apipage');
// });
//设置跨域访问
router.all('*', function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*');
  //允许的header类型
  res.header('Access-Control-Allow-Headers', '*');
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options') res.send(200);
  //让options尝试请求快速结束
  else next();
});
/**统一返回格式: */
let responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: '',
  };
  next();
});
/**用户注册
 *  注册逻辑
 *  1.用户名不能为空
 *  2.密码不能为空
 *  3.俩次密码需要一致
 *
 * 1.用户是否已经被注册
 *  数据库查询
 *
 */
/**登录 */
router.post('/admin/login', function (req, res) {
  let username = req.body.name;
  let password = req.body.password;
  password = crypto.md5(password);
  if (username == '' || password == '') {
    res.json({
      code: 500,
      msg: '请输入用户名或者密码',
    });
    return;
  }

  //查询数据库中相同用户名和密码的记录是否存在 如果存在则登陆成功
  User.findOne({
    username: username,
    password: password,
  }).then(function (userInfo) {
    if (!userInfo) {
      res.json({
        code: 500,
        msg: '用户名或者密码错误',
      });
      return;
    }

    //说明用户名和密码正确
    responseData.code = 200;
    responseData.msg = 'ok';
    responseData.role = userInfo.role;
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username,
      isAdmin: userInfo.isAdmin,
    };
    req.session.user = {
      _id: userInfo._id,
      username: userInfo.username,
      isAdmin: userInfo.isAdmin,
    };
    res.json(responseData);
    return;
  });
});
/**退出 */
router.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (!(err === null)) {
      console.log(err);
    }
  }); //通过destroy销毁session
  res.json({
    code: 200,
    msg: 'ok',
  });
});

/**文章分类接口 */
router.get('/categories', function (req, res) {
  Category.count().then(function (count) {
    //获取总条数count
    /**
     * 1升序
     * -1降序
     */
    Category.find()
      .sort({ _id: -1 })
      .populate({
        path: 'user',
        select: { username: 1, _id: 0 },
      })
      .then(function (categories) {
        mockData = {
          code: 200,
          msg: 'ok',
          data: categories,
          dataCount: count,
        };
        res.json(mockData);
      });
  });
});

/**单个文章接口 */
router.get('/article', function (req, res) {
  //获取文章_id
  let id = req.query.art_id || '';
  if (!id) {
    res.json({
      code: 500,
      msg: '请输入文章id',
    });
    return;
  }
  Article.findOne({
    _id: id,
  }).then(function (Article) {
    if (!Article) {
      res.json({
        code: 500,
        msg: '该文章不存在',
      });
      Promise.reject();
    } else {
      res.json({
        code: 200,
        data: Article,
      });
    }
  });
  //获取post提交过来的名称
});

/**搜索文章接口 */
router.get('/search', function (req, res) {
  //获取文章_id
  let keyword = req.query.keyword || '';
  let user_id = req.query.user_id || '';
  let page = Number(req.query.page || 1); //注意验证 是否为数字
  let limit = Number(req.query.limit || 5); //注意验证 是否为数字 //限制条数
  let search = new RegExp('^.*' + keyword + '.*$');
  let where = {
    title: search,
  };

  let getmsg = function (where) {
    Article.count(where).then(function (count) {
      //计算总页数
      let pages = Math.ceil(count / limit);
      //取值不能超过pages
      page = Math.min(page, pages);
      //取值不能小于1
      page = Math.max(page, 1);
      //限定上一页下一页取值
      let skip = (page - 1) * limit;
      /**
       * 1升序
       * -1降序
       */
      Article.find(
        where,
        //限制查询字段 忽略userID
        { content: 0, description: 0, typearr: 0 }
      )
        .limit(limit)
        .skip(skip)
        .sort({ _id: -1 })
        .populate({
          path: 'category',
          select: { name: 1, _id: 1 },
        })
        .populate({
          path: 'user',
          select: { username: 1, _id: 0 },
        })
        .populate({
          path: 'update_user',
          select: { username: 1, _id: 0 },
        })
        .then(function (articles) {
          mockData = {
            code: 200,
            msg: 'ok',
            data: articles,
            dataCount: count,
          };
          // console.log(mockData);
          res.json(mockData);
        });
    });
  };
  if (user_id) {
    User.findOne({
      _id: user_id,
    }).then((userInfo) => {
      if (!userInfo.isAdmin) {
        where.user = user_id;
      }
      getmsg(where);
    });
  } else {
    getmsg(where);
  }
});

/**所有 以及级分类文章接口 */
router.get('/articles', function (req, res) {
  let user_id = req.query.user_id || '';
  let cate_id = req.query.cate_id || '';
  let page = Number(req.query.page || 1); //注意验证 是否为数字
  let limit = Number(req.query.limit || 5); //注意验证 是否为数字 //限制条数
  let where = {};
  let getmsg = function (where) {
    Article.count(where).then(function (count) {
      //计算总页数
      let pages = Math.ceil(count / limit);
      //取值不能超过pages
      page = Math.min(page, pages);
      //取值不能小于1
      page = Math.max(page, 1);
      //限定上一页下一页取值
      let skip = (page - 1) * limit;
      /**
       * 1升序
       * -1降序
       */
      Article.find(
        where,
        //限制查询字段 忽略userID
        { content: 0, description: 0, typearr: 0 }
      )
        .limit(limit)
        .skip(skip)
        .sort({ _id: -1 })
        .populate({
          path: 'category',
          select: { name: 1, _id: 1 },
        })
        .populate({
          path: 'user',
          select: { username: 1, _id: 0 },
        })
        .populate({
          path: 'update_user',
          select: { username: 1, _id: 0 },
        })
        .then(function (articles) {
          mockData = {
            code: 200,
            msg: 'ok',
            data: articles,
            dataCount: count,
          };
          // console.log(mockData);
          res.json(mockData);
        });
    });
  };

  //需要判断是否是管理员用户 单用户查询
  if (user_id) {
    User.findOne({
      _id: user_id,
    }).then((userInfo) => {
      if (!userInfo.isAdmin) {
        where.user = user_id;
      }
      // console.log(where);
      getmsg(where);
    });
  } else if (cate_id) {
    where.category = cate_id;
    getmsg(where);
  } else {
    getmsg(where);
  }
});

/**用户接口 后台使用 */
router.get('/users', function (req, res) {
  User.count().then(function (count) {
    //获取总条数count
    /**
     * 1升序
     * -1降序
     */
    User.find()
      .sort({ _id: -1 })
      .then(function (users) {
        mockData = {
          code: 200,
          msg: 'ok',
          data: users,
          dataCount: count,
        };
        res.json(mockData);
      });
  });
});
//三级分类接口+数据处理模块
let FormatJson = require('../models/FormatJson');
router.get('/ceteapi', function (req, res) {
  Category.find().then(function (infoes) {
    // console.log(JSON.stringify(infoes));
    if (infoes) {
      FormatJson(JSON.stringify(infoes), function (data) {
        res.json({
          code: 200,
          msg: 'ok',
          data: data,
        });
      });
    } else {
      res.json({
        code: 500,
        msg: '暂无分类数据',
      });
    }
  });
});

//明星用户接口
router.get('/starapi', (req, res) => {
  Star.findAll((err, data) => {
    if (err) {
      res.json({
        code: 500,
        msg: '暂无用户数据',
      });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//首页轮播图接口
router.get('/loopapi', (req, res) => {
  Loop.findAll((err, data) => {
    if (err) {
      res.json({
        code: 500,
        msg: '暂无轮播数据',
      });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//首页特色
router.get('/homeapi', (req, res) => {
  let data_typeid = req.query.type_id || 0;
  Tese.findAll(data_typeid, (err, data) => {
    if (err) {
      res.json({
        code: 500,
        msg: '暂无轮播数据',
      });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

/**json文件数据接口 */
router.get('/jsondatalist', (req, res) => {
  GetJson.getJsonFiles('jsondata', (data) => {
    res.json({
      code: 200,
      msg: 'ok',
      data: data,
      dataCount: data.length,
    });
  });
});

router.get('/jsondata', (req, res) => {
  let name = req.query.name || '';
  if (name) {
    GetJson.getJsonData(name, (err, data) => {
      if (err) {
        res.json({
          code: 500,
          msg: '查询出错',
        });
        return;
      }
      let jsondata = {
        code: 200,
        msg: 'ok',
        data: JSON.parse(data),
      };
      res.json(jsondata);
    });
  } else {
    res.json({
      code: 500,
      msg: '请输入json文件名+.json',
    });
  }
});

/**附件文件数据接口 */
router.get('/ensdatalist', (req, res) => {
  let tag = req.query.tag || '';
  let keyword = req.query.keyword || '';
  if (keyword) {
    Enclosure.searchAll(keyword, (err, data) => {
      if (err) {
        res.json({
          code: 500,
          msg: '暂无文件数据',
        });
      } else {
        res.json(data);
      }
    });
  } else {
    Enclosure.findAll(tag, (err, data) => {
      if (err) {
        res.json({
          code: 500,
          msg: '暂无文件数据',
        });
      } else {
        res.json(data);
      }
    });
  }
});

module.exports = router;
