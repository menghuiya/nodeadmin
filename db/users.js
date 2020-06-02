/**created by 梦回 */

let mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema(
  {
    //用户名
    username: String,
    //密码
    password: String,
    //性别
    sex: String,
    //角色
    role: String,
    //添加时间
    create_time: {
      type: Date,
      default: Date.now()
    },
    //是否启用
    status: {
      type: Number,
      default: 1
    },
    //是否是管理员
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);
