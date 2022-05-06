const express = require('express');
const path = require('path');
const router = require('./controller');
const errorHandler = require('./middleware/error-handler');
const session = require('express-session');

const app = express();

//解析post请求体
app.use(express.urlencoded({extended: false}));

app.use(express.json());

//设置session
app.use(session({
  secret: '8b4f7565-ef89-6c8b-56d4-4289456793df',
  resave: false,
  saveUninitialized: true
}))

//挂载静态资源
app.use('/public', express.static(path.join(__dirname, './public')));

//设置模板引擎
app.engine('html', require('express-art-template'));
//设置模板引擎渲染的路径
app.set('views', path.join(__dirname, './views'));
//可以省略的模板文件后缀名
app.set('view engine', 'html');

//挂载路由
app.use(router());

//当都没有路由时
app.use((req, res, next) => {
  res.render('404');
})

//处理错误中间件
app.use(errorHandler());

app.listen(8080, () => {
  console.log('8080端口监听中...');
})