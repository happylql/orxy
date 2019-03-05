const Router = require('koa-router')
const Redis = require('koa-redis')
const nodeMailer = require('nodemailer')
const User = require('../models/user')
const Passport = require('../utils/passport')
const Config = require("../config")
const service = require('../utils/axios')
const Consts = require('../options/consts')
const ERROR = require('../options/error')
const { CODE, MSG } = require('../options/error')

const router = new Router({
  prefix: `${Consts.BASE_API}/user`
});

const Store = new Redis().client;

/**
 * 注册
 */
router.post('/signup', async (ctx) => {
  const { username, password, email, code } = ctx.request.body;
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code');
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire');
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: CODE.ERR_IDENTIFY_EXPIRE,
          msg: MSG.ERR_IDENTIFY_EXPIRE
        }
        return;
      }
    } else {
      ctx.body = {
        code: CODE.ERR_IDENTIFY_INVALID,
        msg: MSG.ERR_IDENTIFY_INVALID
      }
    }
  } else {
    ctx.body = {
      code: CODE.ERR_IDENTIFY_EMPTY,
      msg: MSG.ERR_IDENTIFY_EMPTY
    }
  }

  let user = await User.find({ username });
  if (user.length) {
    ctx.body = {
      code: CODE.ERR_USER_REGISTERED,
      msg: MSG.ERR_USER_REGISTERED
    }
    return;
  }

  let newer = await User.create({ username, password, email });
  if (newer) {
    let res = await service.post('/user/signin', { username, password });
    if (res.data && res.data.code === CODE.SUCCESS) {
      ctx.body = {
        code: CODE.SUCCESS,
        msg: MSG.SUCCESS,
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: CODE.FAIL,
        msg: MSG.FAIL
      }
    }
  } else {
    ctx.body = {
      code: CODE.ERR_USER_REGISTER_FAIL,
      msg: MSG.ERR_USER_REGISTER_FAIL
    }
  }
})

/**
 * 登录
 */
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: CODE.FAIL,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: CODE.SUCCESS,
          msg: MSG.SUCCESS,
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: CODE.FAIL,
          msg: info
        }
      }
    }
  })(ctx, next)
})

/**
 * 邮箱发送
 */
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username;
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire');
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: CODE.ERR_REQUEST_FREQUENTLY,
      msg: CODE.ERR_REQUEST_FREQUENTLY
    }
    return;
  }

  let transporter = nodeMailer.createTransport({
    host: Config.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Config.smtp.user,
      pass: Config.smtp.pass
    }
  });

  let ko = {
    code: Config.smtp.code(),
    expire: Config.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  let mailOptions = {
    from: `认证邮件<${Config.smtp.user}>`,
    to: to.email,
    subject: '21CN游戏管理平台注册码',
    html: `您在21CN游戏管理平台中注册，验证码是${ko.code}`
  }

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
  });

  ctx.body = {
    code: CODE.ERR_REQUEST_FREQUENTLY,
    msg: "验证码已经发送，可能会有延时，有效期1分钟"
  }
})

/**
 * 退出
 */
router.get('/exit', async (ctx, next) => {
  await ctx.logout();
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: CODE.SUCCESS,
      msg: MSG.SUCCESS
    }
  } else {
    ctx.body = {
      code: CODE.FAIL,
      msg: MSG.FAIL
    }
  }
})

/**
 * 获取用户信息
 */
router.get('/info', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user;
    // TODO: roles 权限
    ctx.body = {
      name: username,
      email
    }
  } else {
    ctx.body = {
      name: '',
      email: ''
    }
  }
})

module.exports = router.routes();
