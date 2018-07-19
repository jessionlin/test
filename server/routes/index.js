/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

const md5 = require('md5');
let salt = 'salon'; // 加盐

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)
/**
 * 设置访问路由
 */
// 登陆处理
router.post('/login', async (ctx, next) => {
  await next();
  console.log(`handle login ...`);
  let msg = {};
  let flag = false;
  await new Promise(function (resolve, reject) {
    connection.query("select * from user_account where user_name = ?", [ctx.request.body.username], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.length !== 0) {
      flag = true;
    } else {
      msg['success'] = false;
      msg['err'] = '没有这个用户';
    }
  });
  if (flag) {
    await new Promise(function (resolve, reject) {
      connection.query("select * from salesman_account where user_name = ? and password = ?",
        [ctx.request.body.username, md5(ctx.request.body.password + salt)],
        function (err, results, fields) {
          if (err) throw err;
          resolve(results);
        });
    }).then((value) => {
      if (value.length !== 0) {
        msg['success'] = true;
        ctx.session.user = value[0]['user_name'];
      } else {
        msg['success'] = false;
        msg['err'] = '密码错误';
      }
    });
  }
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 注册处理
router.post('/register', async (ctx, next) => {
  await next();
  console.log(`handle register ...`);
  let msg = {};
  let flag = false;
  let user_id;
  let user_name = ctx.request.body.user_name.trim(),
    password = ctx.request.body.password.trim(),
    real_name = ctx.request.body.real_name.trim(),
    school_id = ctx.request.body.school_id.trim(),
    profession_id = ctx.request.body.profession_id.trim(),
    phone = ctx.request.body.phone.trim(),
    email = ctx.request.body.email.trim(),
    characteristic = ctx.request.body.characteristic.trim();
  if (!user_name || !password || !real_name || !school_id || !profession_id || !phone || !email || !characteristic || !characteristic.length) {
    msg['success'] = false;
    msg['err'] = '请填写所有字段';
    ctx.type = 'json';
    ctx.body = JSON.stringify(msg);
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from user_account where name = ?", [user_name], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.length === 0) {
      flag = true;
    } else {
      msg['success'] = false;
      msg['err'] = '该用户名已经被注册';
    }
  });
  if (flag) {
    await new Promise(function (resolve, reject) {
      connection.execute("insert into user_account values(0, ?, ?, ?, ?, ?, ?, ?)",
        [user_name, real_name, md5(password + salt), school_id, profession_id, phone, email],
        function (err, results, fields) {
          if (err) throw err;
          // results = JSON.stringify(results);
          resolve(results);
        });
    }).then((value) => {
      if (value.insertId > 0) {
        user_id = value.insertId;
        msg['success'] = true;
      } else {
        msg['success'] = false;
        msg['err'] = '注册失败(插入数据失败)';
      }
    });
    if (msg['success']) {
      let sql = '(0, ' + user_id + ', ' + characteristic[0] + ')';
      for (let k = 0; k < characteristic.length - 1; k++) {
        sql += ',(0, ' + user_id + ', ' + characteristic[k + 1] + ')';
      }
      await new Promise(function (resolve, reject) {
        connection.execute("insert into user_characteristic values" + sql,
          function (err, results, fields) {
            if (err) throw err;
            resolve(results);
          });
      }).then((value) => {
        console.log(value); // 插入多条特藏数据的
        if (value.insertId > 0) {
          msg['success'] = true;
        } else {
          msg['success'] = false;
          msg['err'] = '注册失败(插入数据失败)';
        }
      });
    }
  }
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 判断用户名是否已经被注册
router.post('/useful_name', async (ctx, next) => {
  await next();
  console.log(`check user name is useful ...`);
  let msg = {};
  await new Promise(function (resolve, reject) {
    connection.query("select * from user_account where name = ?", [ctx.request.body.user_name], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.length === 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '该用户名已经被注册';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取学校数据
router.get('/data/school', async (ctx, next) => {
  await next();
  console.log(`get school data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from school", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    msg['success'] = true;
    msg['data'] = value;
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取专业数据
router.get('/data/profession', async (ctx, next) => {
  await next();
  console.log(`get profession data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from profession", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    msg['success'] = true;
    msg['data'] = value;
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取特长类别数据
router.get('/data/characteristic_type', async (ctx, next) => {
  await next();
  console.log(`get characteristic_type data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from characteristic_type", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    msg['success'] = true;
    msg['data'] = value;
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取某类别下所有特长数据
router.post('/data/characteristic', async (ctx, next) => {
  await next();
  console.log(`get characteristic data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let type_id = ctx.request.body.type_id.trim();
  await new Promise(function (resolve, reject) {
    connection.query("select * from characteristic where type_id = ?", [type_id], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    msg['success'] = true;
    msg['data'] = value;
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取所有项目信息数据
router.get('/projects', async (ctx, next) => {
  await next();
  console.log(`get projects data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from projects order by date desc, group_number_now asc", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    msg['success'] = true;
    msg['data'] = value;
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 根据条件(已完成,组队成功,组队未成功)获取项目信息数据
router.post('/data/projects', async (ctx, next) => {
  await next();
  console.log(`get characteriatic_type data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let type = ctx.request.body.type.trim();
  let sql;
  if (type === 1) { // 查询已完成项目
    sql = 'where progress_id = 4';
  } else if (type === 2) { // 查询组队完成项目
    sql = 'where group_number_now = group_number';
  } else if (type === 3) {
    sql = 'where group_number_now < group_number';
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from projects " + sql, function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    msg['success'] = true;
    msg['data'] = value;
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 添加项目
router.post('/projects', async (ctx, next) => {
  await next();
  console.log(`create projects ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let user_id = ctx.session.id,
    project_name = ctx.request.body.project_name.trim(),
    project_describe = ctx.request.body.project_describe.trim(),
    date = ctx.request.body.date.trim(),
    image_url = ctx.request.body.image_url.trim(),
    group_number = ctx.request.body.group_number.trim(),
    group_number_now = ctx.request.body.group_number_now.trim(),
    group_describe = ctx.request.body.group_describe.trim(),
    process_id = ctx.request.body.process_id.trim();
  await new Promise(function (resolve, reject) {
    connection.query("insert into projects values(0, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)",
      [user_id, project_name, project_describe, date, image_url, group_number, group_number_now, group_describe, process_id], function (err, results, fields) {
        if (err) throw err;
        resolve(results);
      });
  }).then((value) => {
    if (value.affectedRows > 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '添加项目失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取项目进度定义
router.get('/data/progress', async (ctx, next) => {
  await next();
  console.log(`get progress data ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from progress", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.length > 0) {
      msg['success'] = true;
      msg['data'] = value;
    } else {
      msg['success'] = false;
      msg['err'] = '获取项目定义失败';
    }

  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 点赞操作(项目或新闻)
router.post('/thumb', async (ctx, next) => {
  await next();
  console.log(`thumb ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let id = ctx.request.body.id.trim(),
    table = ctx.request.body.table.trim();
  await new Promise(function (resolve, reject) {
    connection.query("update ? set thumb_number = thumb_number + 1 where id = ?", [table, id], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.affectedRows > 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '点赞失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 取消点赞操作(项目或新闻)
router.post('/unthumb', async (ctx, next) => {
  await next();
  console.log(`unthumb ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let id = ctx.request.body.id.trim(),
    table = ctx.request.body.table.trim();
  await new Promise(function (resolve, reject) {
    connection.query("update ? set thumb_number = thumb_number + 1 where id = ?", [table, id], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.affectedRows > 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '取消点赞失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 修改阅读量(项目或新闻)
router.post('/read', async (ctx, next) => {
  await next();
  console.log(`read ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let id = ctx.request.body.id.trim(),
    table = ctx.request.body.table.trim();
  await new Promise(function (resolve, reject) {
    connection.query("update ? set page_views = page_views + 1 where id = ?", [table, id], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.affectedRows > 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '增加阅读量失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取新闻列表
router.get('/news', async (ctx, next) => {
  await next();
  console.log(`get all news ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select id, title, image_url, date, type, page_views, thumb_number from news", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.length > 0) {
      msg['success'] = true;
      msg['data'] = value;
    } else {
      msg['success'] = false;
      msg['err'] = '获取新闻列表失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取某个新闻具体内容信息
router.post('/news', async (ctx, next) => {
  await next();
  console.log(`get detail message from one news ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let id = ctx.request.body.id.trim();
  await new Promise(function (resolve, reject) {
    connection.query("select * from news where id = ?", [id], function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.length > 0) {
      msg['success'] = true;
      msg['data'] = value;
    } else {
      msg['success'] = false;
      msg['err'] = '获取新闻详情失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 发布新闻
router.post('/news/creation', async (ctx, next) => {
  await next();
  console.log(`create news ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let title = ctx.request.body.title.trim(),
    content = ctx.request.body.content.trim(),
    image_url = ctx.request.body.image_url.trim(),
    date = ctx.request.body.date.trim(),
    type = ctx.request.body.type.trim();
  await new Promise(function (resolve, reject) {
    connection.query("insert into news values(0, ?, ?, ?, ?, ?, 0, 0)",
      [title, content, image_url, date, type], function (err, results, fields) {
        if (err) throw err;
        resolve(results);
      });
  }).then((value) => {
    if (value.affectedRows > 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '创建新闻失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 列出项目成员
router.post('/group', async (ctx, next) => {
  await next();
  console.log(`list group of projects ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  let project_id = ctx.request.body.project_id.trim();
  await new Promise(function (resolve, reject) {
    connection.query("select group.id, user_account.user_name, user_account.real_name, role.role from (`group` left join user_account on group.user_id = user_account.id) left join role on group.role_id = role.id where group.project_id = ?",
      [project_id], function (err, results, fields) {
        if (err) throw err;
        resolve(results);
      });
  }).then((value) => {
    if (value.length > 0) {
      msg['success'] = true;
      msg['data'] = value;
    } else {
      msg['success'] = false;
      msg['err'] = '获取项目成员失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});
// 获取所有角色信息
router.get('/data/role', async (ctx, next) => {
  await next();
  console.log(`list roles ...`);
  let msg = {};
  if (!ctx.session.username) {
    msg['success'] = false;
    msg['err'] = '请先登陆';
    return;
  }
  await new Promise(function (resolve, reject) {
    connection.query("select * from role", function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  }).then((value) => {
    if (value.affectedRows > 0) {
      msg['success'] = true;
    } else {
      msg['success'] = false;
      msg['err'] = '获取角色信息失败';
    }
  });
  ctx.type = 'json';
  ctx.body = JSON.stringify(msg);
});

module.exports = router
