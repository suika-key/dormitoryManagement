const { User } = require('../model');
const md5 = require('../util/md5');

module.exports = {
  'GET /': async (req, res, next) => {
    try {
      res.render('login');
    } catch(err) {
      next(err);
    }
  },

  'POST /login': async (req, res, next) => {
    try {
      //数据验证
      const body = req.body;
      //查询数据库用户名密码是否正确
      const user = await User.findOne({
        userId: body.userId,
        password: md5(md5(body.password))
      });
      //用户不存在
      if(!user) {
        return res.status(200).json({
          err_code: 1,
          message: '用户名或者密码错误'
        })
      };
      //保存session
      req.session.user = user;
      res.status(200).json({
        err_code: 0,
        message: 'OK',
        status: user.userStatus
      });
    } catch(err) {
      next(err);
    }
  },

  'GET /logout': async (req, res, next) => {
    try {
      //退出登录
      //删除用户的session
      req.session.destroy();
      //重定向到登录界面
      res.redirect('/');
    } catch(err) {
      next(err);
    }
  }
}