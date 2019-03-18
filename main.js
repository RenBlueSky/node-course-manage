const express = require('express');
const app = express();

// 静态文件处理，例如img (public文件下的文件都是静态文件)
const path = require("path");
app.use(express.static(path.join(__dirname,"public")));

//引入express-handlebars
const exphbs  = require('express-handlebars');
app.engine('hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

//引入mongoose,并指向数据库地址，连接数据库
const mongoose = require("mongoose");
const db = require("./config/database");
mongoose.connect(db.base_url).then(()=>{
    console.log("数据库已连接")
}).catch((e)=>{
    console.log("数据库连接失败")
})

// 引入实现put方法(更新/编辑)
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//引入body-parser
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 引入passport 
const passport = require("passport");
require('./config/passport')(passport);

// 引入express-session
const session = require("express-session");
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());


// 引入connect-flash
const connectFlash = require("connect-flash");
app.use(connectFlash());
// 全局变量
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})

// 引入路由
const course = require("./routers/course");
app.use("/ideas",course);
const users = require("./routers/users");
app.use("/users",users);

// 配置路由
app.get("/" , (req,res)=>{
    const title = "大家好"
    res.render("home",{
        title:title
    });
});

app.get("/about",(req,res)=>{
    res.render("about") //会直接在views文件夹中找.hbs
});


// 监听端口
const port = process.env.PORT || 5000;
app.listen(port , ()=>{

})