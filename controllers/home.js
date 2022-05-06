const { Admin, User, Dorm, Floor, Student } = require('../model');
//使用两次MD5加密 也可以一次MD5加密然后加盐加密
const md5 = require('../util/md5');

module.exports = {
  'GET /adminManage': async (req, res, next) => {
    try {
      //判断登录可以写到一个中间件
      //判断用户是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      //判断用户的权限
      if(req.session.user.userStatus !== '2') {
       return res.redirect('/404'); 
      };
      //数据分页
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = 10;
      //查询管理员数据
      const admins = await Admin.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      //获取数据的数目
      const adminCount = await Admin.count();
      res.render('adminManage', {
        admins,
        page,
        pageSize,
        adminCount,
        //进行分页计算
        totalPage: Math.ceil(adminCount / pageSize),
        title: '用户管理',
        status: req.session.user.userStatus,
        name: '管理员'
      });
    } catch(err) {
      next(err);
    }
  },

  'POST /adminManage': async (req, res, next) => {
    try {
      //判断用户是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      //接收表单
      const body = req.body;
      //判断用户名是否存在
      let user = await User.findOne({
        userId: body.userId
      });
      //存在
      if(user) {
        return res.status(200).json({
          err_code: 2,
          message: '该id已存在!'
        });
      }
      //正则表达式判断联系方式
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if(!reg.test(body.admTel)) {
        return res.status(200).json({
          err_code: 3,
          message: '该联系方式格式不正确!'
        });
      }
      //存入用户数据库
      user = new User({
        userId: body.userId,
        password: md5(md5(body.password)),
        userStatus: '1'
      });
      await user.save();
      //存入admin数据库
      const admin = new Admin({
        admId: body.userId,
        admName: body.admName,
        admSex: body.admSex,
        admTel: body.admTel
      });
      await admin.save();
      //成功
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'DELETE /deleteAdmin': async (req, res, next) => {
    try {
      //判断用户是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const admin = await Admin.findOneAndDelete({
        admId: req.query.admId
      });
      const user = await User.findOneAndDelete({
        userId: req.query.admId
      });
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    } catch(err) {
      next(err);
    }
  },

  'PUT /modifyAdmin': async (req, res, next) => {
    try {
      //判断用户是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const body = req.body;
      const admin = await Admin.findOneAndUpdate({
        admId: body.userId
      }, {
        admName: body.admName,
        admTel: body.admTel,
        admSex: body.admSex
      });
      if(!admin) {
        //修改失败
        return res.status(200).json({
          err_code: 4,
          message: '修改失败!'
        });
      }
      //修改成功
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'GET /dormManage': async (req, res, next) => {
    try {
      //判断用户是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      //判断用户的权限
      if(req.session.user.userStatus !== '1') {
        return res.redirect('/404'); 
      };
      //数据分页
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = 10;
      //查收宿舍数据库
      const dorms = await Dorm.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      //获取宿舍总数
      const dormCount = await Dorm.count();
      res.render('dormManage', {
        title: '宿舍管理',
        status: req.session.user.userStatus,
        page,
        dorms,
        pageSize,
        dormCount,
        totalPage: Math.ceil(dormCount / pageSize),
        name: '宿舍'
      });
    } catch(err) {
      next(err);
    }
  },
  
  'POST /dormManage': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const body = req.body;
      //判断此宿舍id是否存在
      let dorm = await Dorm.findOne({
        dorId: body.dorId
      });
      if(dorm) {
        return res.status(200).json({
          err_code: 5,
          message: '该宿舍已经存在!'
        });
      };
      //判断楼层是否已满
      const isFull = await Floor.findOne({
        flId: body.flId
      });
      //不为空且宿舍已满
      if(isFull && !isFull.surplusRoom) {
        return res.status(200).json({
          err_code: 6,
          message: '该楼层宿舍已满!'
        });
      };
      //添加到数据库
      dorm = new Dorm({
        dorId: body.dorId,
        dorNum: body.dorNum,
        dorFact: body.dorFact,
        flId: body.flId
      });
      await dorm.save();
      let floor = null;
      //如果不存在就创建
      if(!isFull) {
        floor = new Floor({
          flId: body.flId,
          surplusRoom: 9
        });
        await floor.save();
      } else {
        let surplusRoom = isFull.surplusRoom;
        //存在就减少一个空宿舍
        floor = await Floor.findOneAndUpdate({
          flId: body.flId
        }, {
          surplusRoom: (--surplusRoom)
        });
      }
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'DELETE /deleteDorm': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      let dorFact = (await Dorm.findOne({
        dorId: req.query.dorId
      })).dorFact;
      if(dorFact > 0) {
        return res.status(200).json({
          err_code: 9,
          message: '宿舍还有学生居住, 无法删除!'
        });
      };
      //删除数据
      const dorm = await Dorm.findOneAndDelete({
        dorId: req.query.dorId
      });
      let surplusRoom = (await Floor.findOne({
        flId: dorm.flId
      })).surplusRoom;
      const floor = await Floor.findOneAndUpdate({
        flId: dorm.flId
      }, {
        surplusRoom: (++surplusRoom)
      });
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'GET /stuManage': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      //判断用户的权限
      if(req.session.user.userStatus !== '1') {
        return res.redirect('/404'); 
      };
      //数据分页
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = 10;
      //查看学生数据库
      const students = await Student.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      //获取宿舍总数
      const stuCount = await Student.count();
      res.render('stuManage', {
        title: '学生管理',
        status: req.session.user.userStatus,
        page,
        students,
        pageSize,
        stuCount,
        totalPage: Math.ceil(stuCount / pageSize),
        name: '学生'
      });
    } catch(err) {
      next(err);
    }
  },

  'POST /stuManage': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const body = req.body;
      //判断学生id是否重复
      let student = await Student.findOne({
        stuKey: body.stuKey
      });
      //存在
      if(student) {
        return res.status(200).json({
          err_code: 7,
          message: '学生学号已存在!'
        });
      };
      //判断宿舍是否已满
      let dorm = await Dorm.findOne({
        dorId: body.dorId
      });
      //宿舍已满
      if(dorm.dorFact === dorm.dorNum) {
        return res.status(200).json({
          err_code: 8,
          message: '该宿舍已满!'
        });
      };
      //添加到数据库
      student = new Student({
        stuKey: body.stuKey,
        stuName: body.stuName,
        stuSex: body.stuSex,
        college: body.college,
        major: body.major,
        dorId: body.dorId
      });
      await student.save();
      //添加学生账号
      const user = new User({
        userId: body.stuKey,
        //默认学号后六位
        password: md5(md5(body.stuKey.slice(-6))),
        userStatus: '0'
      });
      await user.save();
      //更新宿舍人数
      let dorFact = dorm.dorFact;
      dorm = await Dorm.findOneAndUpdate({
        dorId: body.dorId
      }, {
        dorFact: (++dorFact)
      });
      //如果是宿舍详细页面来的请求
      if(req.get('referer').includes('stuDorm')) {
        return res.status(200).json({
          err_code: 'stuDorm',
          message: '重定向到/stuDorm',
          dorId: body.dorId
        });
      };
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },
  
  'DELETE /deleteStu': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      //删除数据
      const student = await Student.findOneAndDelete({
        stuKey: req.query.stuKey
      });
      //宿舍减少一个人
      let dorFact = (await Dorm.findOne({
        dorId: student.dorId
      })).dorFact;
      const dorm = await Dorm.findOneAndUpdate({
        dorId: student.dorId
      }, {
        dorFact: (--dorFact)
      });
      //如果是宿舍详细页面来的请求
      if(req.get('referer').includes('stuDorm')) {
        return res.status(200).json({
          err_code: 'stuDorm',
          message: '重定向到/stuDorm',
          dorId: student.dorId
        });
      };
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'PUT /modifyStu': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const body = req.body;
      //修改数据库
      const student = await Student.findOneAndUpdate({
        stuKey: body.stuKey
      }, {
        stuName: body.stuName,
        college: body.college,
        major: body.major,
        stuSex: body.stuSex
      });
      if(!student) {
        //修改失败
        return res.status(200).json({
          err_code: 4,
          message: '修改失败!'
        });
      }
      //如果是宿舍详细页面来的请求
      if(req.get('referer').includes('stuDorm')) {
        return res.status(200).json({
          err_code: 'stuDorm',
          message: '重定向到/stuDorm',
          dorId: student.dorId
        });
      };
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'PUT /changeDorm': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const body = req.body;
      //查询数据库
      let student = await Student.findOne({
        stuKey: body.stuKey
      });
      //更换的宿舍是否相同
      if(student.dorId === body.dorId) {
        return res.status(200).json({
          err_code: 10,
          message: '更换的是原来的宿舍!'
        });
      };
      //判断更换的宿舍是否存在或者已满
      let newDorm = await Dorm.findOne({
        dorId: body.dorId
      });
      if(!newDorm) {
        return res.status(200).json({
          err_code: 11,
          message: '该宿舍不存在!'
        });
      } else if(newDorm.dorFact === newDorm.dorNum) {
        return res.status(200).json({
          err_code: 8,
          message: '该宿舍已满!'
        });
      }
      let dorFact = (await Dorm.findOne({
        dorId: student.dorId
      })).dorFact;
      const oldDorm = await Dorm.findOneAndUpdate({
        dorId: student.dorId
      }, {
        dorFact: (--dorFact)
      });
      //更新数据
      student = await Student.findOneAndUpdate({
        stuKey: body.stuKey
      }, {
        dorId: body.dorId
      });
      newDorm = await Dorm.findOneAndUpdate({
        dorId: newDorm.dorId
      }, {
        dorFact: (++newDorm.dorFact)
      });
      //如果是宿舍详细页面来的请求
      if(req.get('referer').includes('stuDorm')) {
        return res.status(200).json({
          err_code: 'stuDorm',
          message: '重定向到/stuDorm',
          dorId: oldDorm.dorId
        });
      };
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      });
    } catch(err) {
      next(err);
    }
  },

  'GET /stuDorm': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      const students = await Student.find({
        dorId: req.query.dorId
      });
      //判断用户的权限
      if(req.session.user.userStatus !== '1' && students === null) {
        return res.redirect('/404'); 
      };
      res.render('stuDorm', {
        students,
        dorId: req.query.dorId,
        status: req.session.user.userStatus
      });
    } catch(err) {
      next(err);
    }
  },

  'GET /stuInfo': async (req, res, next) => {
    try {
      //判断是否登录
      if(!req.session.user) {
        return res.redirect('/');
      };
      //判断用户的权限
      if(req.session.user.userStatus !== '0') {
        return res.redirect('/404'); 
      };
      const student = await Student.findOne({
        stuKey: req.session.user.userId
      });
      res.render('stuInfo', {
        student,
        status: req.session.user.userStatus
      })
    } catch(err) {
      next(err);
    }
  }
}