// 一个菜单可以包括的所有属性
// {
// 	id: '12345',		// 菜单id, 必须唯一
// 	name: '用户中心',		// 菜单名称, 同时也是tab选项卡上显示的名称
// 	icon: 'el-icon-user',	// 菜单图标, 参考地址:  https://element.eleme.cn/#/zh-CN/component/icon
//	info: '管理所有用户',	// 菜单介绍, 在菜单预览和分配权限时会有显示
// 	url: 'sa-html/user/user-list.html',	// 菜单指向地址
// 	parent_id: 1,			// 所属父菜单id, 如果指定了一个值, sa-admin在初始化时会将此菜单转移到指定菜单上
// 	is_show: true,			// 是否显示, 默认true
// 	is_blank: false,		// 是否属于外部链接, 如果为true, 则点击菜单时从新窗口打开
// 	childList: [			// 指定这个菜单所有的子菜单, 子菜单可以继续指定子菜单, 至多支持三级菜单
// 		// ....
// 	],
//	click: function(){}		// 点击菜单执行一个函数
// }

// 定义菜单列表
var menuList = [
  {
    id: '1',
    name: '首页设置',
    icon: 'el-icon-s-home',
    info: '首页的一些设置',
    childList: [
      { id: '1-2', name: '轮播图设置', url: '/admin/sa-html/home/list' },
      { id: '1-3', name: '学院特色', url: '/admin/sa-html/home/tese' },
      { id: '1-4', name: '学生培养成果', url: '/admin/sa-html/home/chengguo' },
      { id: '1-5', name: '毕业学生成果', url: '/admin/sa-html/home/chengguo2' },
    ],
  },
  {
    id: '2',
    name: '用户管理',
    icon: 'el-icon-user',
    info: '对用户列表、添加、统计等等...',
    childList: [
      { id: '2-1', name: '用户列表', url: '/admin/sa-html/user/user-list' },
      { id: '2-2', name: '用户添加', url: '/admin/sa-html/user/user-add' },
    ],
    is_show: sa.isAuth(true),
  },
  {
    id: '3',
    name: '文章分类',
    icon: 'el-icon-copy-document',
    info: '对文章分类修改删除',
    childList: [
      {
        id: '3-1',
        name: '分类列表',
        url: '/admin/sa-html/category/cate-list',
      },
      { id: '3-2', name: '分类添加', url: '/admin/sa-html/category/cate-add' },
    ],
    is_show: sa.isAuth(true),
  },

  {
    id: '4',
    name: '文章管理',
    icon: 'el-icon-document-copy',
    info: '对文章的增删改查、维护',
    childList: [
      { id: '4-1', name: '文章列表', url: '/admin/sa-html/article/art-list' },
      { id: '4-2', name: '文章发表', url: '/admin/sa-html/article/art-add' },
    ],
  },
  {
    id: '5',
    name: '明星用户',
    icon: 'el-icon-star-off',
    info: '对明星用户的增删改查、维护',
    childList: [
      { id: '5-1', name: '明星列表', url: '/admin/sa-html/star/list' },
      { id: '5-2', name: '明星增加', url: '/admin/sa-html/star/add' },
    ],
  },
  {
    id: '6',
    name: 'json管理',
    icon: 'el-icon-tickets',
    info: '对json文件的增删改查、维护',
    childList: [
      { id: '6-1', name: '文件列表', url: '/admin/sa-html/jsondata/list' },
      { id: '6-2', name: '文件增加', url: '/admin/sa-html/jsondata/add' },
    ],
    is_show: sa.isAuth(true),
  },
  {
    id: '7',
    name: '附件管理',
    icon: 'el-icon-folder-opened',
    info: '对json文件的增删改查、维护',
    childList: [{ id: '7-1', name: '文件列表', url: '/admin/enclosure/list' }],
    is_show: sa.isAuth(true),
  },
  {
    id: '8',
    name: '系统设置',
    icon: 'el-icon-setting',
    childList: [
      {
        id: '8-1',
        name: '服务器设置',
        url: '/admin/sa-html/cfg/system-cfg',
        info: '对服务器参数的设置',
      },
      { id: '8-2', name: '系统日志', url: '/admin/record' },
    ],
    is_show: sa.isAuth(true),
  },
  //  ========= 示例 外部链接 点击从新窗口打开 ================

  //  ========= 示例 隐藏的菜单，最终将不会显示在菜单栏里 ================
  {
    id: '9',
    name: '一个隐藏菜单',
    url: 'https://www.baidu.com/',
    is_blank: true,
    is_show: false, // 隐藏
  },
];
