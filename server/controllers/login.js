// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    // if (ctx.state.$wxInfo.loginState) {
    //     ctx.state.data = ctx.state.$wxInfo.userinfo
    //     ctx.state.data['time'] = Math.floor(Date.now() / 1000)
    // }
}

// web 框架
const Koa = require('koa');
const app = new Koa();

// 路由
const Router = require('koa-router');
const router = Router();

// 解析post请求，将参数设置到 ctx.request.body 上
const Parser = require('koa-bodyparser');
app.use(Parser());

// 静态文件的使用，所有的静态资源都会在 ./static目录下去寻找
const staticfile = require('koa-static');
const path = require('path');
const staticPath = './static';
app.use(staticfile(path.join(__dirname, staticPath)));

// 数据库引用
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '336699',
  database: 'salon'
});

// 加密算法
const md5 = require('md5');
let salt = 'salon'; // 加盐

// session
const session = require('koa-session');
app.keys = ['this is the secret session key of salon project']; // session 信息加密密钥
app.use(session({
  key: 'koa:sess', /** cookie的名称，可以不管 */
  maxAge: 7200000, /** (number) maxAge in ms (default is 1 days)，cookie的过期时间，这里表示2个小时 */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
}, app));


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
    faculty_id = ctx.request.body.faculty_id.trim(),
    profession_id = ctx.request.body.profession_id.trim(),
    phone = ctx.request.body.phone.trim(),
    email = ctx.request.body.email.trim(),
    characteristic = ctx.request.body.characteristic.trim();
  if (!user_name || !password || !real_name || !school_id || !faculty_id || !profession_id || !phone || !email || !characteristic || !characteristic.length) {
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
      connection.execute("insert into user_account values(0, ?, ?, ?, ?, ?, ?, ?, ?)",
        [user_name, real_name, md5(password + salt), school_id, faculty_id, profession_id, phone, email],
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
// 获取数据
router.post('/data', async (ctx, next) => {

});


// 加载router中所有定义的routes
app.use(router.routes());

module.exports = app;

