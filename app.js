/**
 * created by 梦回
 * 应用程序的启动入口
 */
// 加载express模块
let express = require('express');
//加载模板处理模块
let swig = require('swig');
//加载数据库模块
let mongoose = require('mongoose');
//加载body-parser 用来处理post提交都数据
let bodyParser = require('body-parser');
//加载cookies模块
let Cookies = require('cookies');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //持久化存储session
const fs = require('fs');
const ueditor = require('ueditor');
const path = require('path');
//创建app应用 =>nodejs http.createServer();
let app = express();

let User = require('./models/User');
//设置静态文件托管
//当用户访问的url以/public 开始 那么直接返回对应的__dirname + 'public'下的文件
app.use('/public', express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用的模板引擎
//第一个参数:模板引擎的名称 同时也是模板文件的后缀,
//第二个参数:表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录,第一个参数必须是views,第二个参数时目录
app.set('views', './views');
//注册所使用的的模板引擎,第一个必须是view engine
///第二个参数和app.engine这个方法定义的模板引擎的名称(第一个参数)一致
app.set('view engine', 'html');
//在开发过程当中 需要取消模板缓存的限制
swig.setDefaults({ cache: false });

/**
 * 首页
 * req request对象
 * res response 对象
 * next 函数
 */
// app.get('/', function(req, res, next) {
//   // res.send('<h1>欢迎光临我的博客!</h1>');
//   /**
//    * 读取views目录下的指定文件,解析并返回给客户端
//    * 第一个参数 表示模板的文件相对于views目录 Views/index.html
//    * 第二个参数 传递给模板使用的数据
//    */
//   res.render('index');
// });

//bodyparser 设置
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
/**判断是否登录 */
app.use(function (req, res, next) {
  if (req.url == '/install') {
    next();
  } else {
    fs.exists('install.block.txt', function (exists) {
      if (!exists) {
        res.writeHead(200, { 'Content-Type': 'text/html;l;charset=utf-8' });
        res.end(
          `<h2>检测到您第一次安装,请 <a href="/install">点击此处</a>  进行安装</h2> `
        );
        // res.render('install');
      } else {
        next();
      }
    });
  }
});
//激活session,默认是内存存储
//设置session  req.session.foo="bar"
//访问session req.session.foo
app.use(
  session({
    secret: 'wang qiao wei', //字符串加密
    resave: false,
    name: 'userInfo' /*保存在本地cookie的一个名字 默认connect.sid  可以不设置*/,
    cookie: { maxAge: 86400000 }, //过期时间
    saveUninitialized: true, //无论是否使用,都默认使用,强制将未初始化的 session 存储。  默认值是true  建议设置成true
    rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    store: new MongoStore({
      url: 'mongodb://menghui:menghui@127.0.0.1:27017/forum', //数据库的地址  shop是数据库名
      touchAfter: 24 * 3600, // 通过这样做，设置touchAfter:24 * 3600，您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
    }),
  })
);
/**设置上传大小 */

/**
 * 根据不同的功能划分模块
 */
app.use('/install', require('./routers/install'));
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//文件上传
app.use(
  '/public/ueditor/ue',
  ueditor(path.join(__dirname, '/'), function (req, res, next) {
    var imgDir = '/public/artimg';
    var ActionType = req.query.action;

    if (
      ActionType === 'uploadimage' ||
      ActionType === 'uploadfile' ||
      ActionType === 'uploadvideo'
    ) {
      var file_url = imgDir; //默认图片上传地址
      // 这里你可以获得上传图片的信息
      /*其他上传格式的地址*/
      if (ActionType === 'uploadfile') {
        file_url = '/public/file/'; //附件
      }
      if (ActionType === 'uploadvideo') {
        file_url = '/public/video'; //视频
      }
      console.log(file_url);
      res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
      res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
      var dir_url = imgDir;
      res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
      // console.log('config.json')
      res.setHeader('Content-Type', 'application/json');
      // res.redirect('/public/ueditor/jsp/config.json');
      res.redirect('/public/ueditor/nodejs/config.json');
    }
  })
);
//监听http请求
mongoose.connect('mongodb://menghui:menghui@127.0.0.1:27017/forum', function (
  err
) {
  if (err) {
    console.log('数据库连接失败');
  } else {
    console.log('数据连接成功');
    app.listen(8081);
  }
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
/**
 * 用户发送一个http请求 ->url ->解析路由->找到匹配的规则->指定绑定函数,返回对应内容至用户
 *
 * /public->静态文件->直接读取指定目录下的文件,返回给用户
 *
 * ->动态->处理业务逻辑,加载模板,解析目标->返回给用户
 * 开启:mongod --dbpath=C:\Users\menghui\Documents\website\blog\db
 * 关闭:
 */
