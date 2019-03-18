const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../models/Users.js");
const User = mongoose.model("user");

//引入body-parser
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// 引入passport
const passport = require("passport");


// 登录
router.get("/login",(req,res)=>{
    res.render("users/login")  //渲染页面
})

// 注册
router.get("/register",(req,res)=>{
    res.render("users/register")
})

router.get("/logout",(req,res)=>{
    res.logout();
    req.flash("success_msg","退出成功");
    res.redirect("/users/login");
})

router.post("/register",urlencodedParser,(req,res)=>{
    let errors = [];
    if(!req.body.name){
        errors.push({errortip:"请填写用户名"});
    }
    if(!req.body.email){
        errors.push({errortip:"请填写邮箱"});
    }
    if(!req.body.password){
        errors.push({errortip:"请填写密码"});
    }
    if(!req.body.shure_password){
        errors.push({errortip:"请填写确认密码"});
    }else if(req.body.password.length !== req.body.shure_password.length){
        errors.push({errortip:"密码长度不一致，请检查后重新填写"});
    }else if(req.body.password !== req.body.shure_password){
        errors.push({errortip:"两次输入密码不一致，请检查后重新填写"});
    }
    if(errors.length>0){
        res.render("users/register",{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            shure_password:req.body.shure_password
        })
    }else{
        User.findOne({email:req.body.email}).then((user)=>{
            console.log(user)
            if(user){
                console.log("用户已存在")
                req.flash("error_msg","邮箱已经存在，请更换邮箱注册")
                res.redirect("/users/register") //重定向路由
            }else{
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    shure_password:req.body.shure_password
                })
                // 10 密码强度
                bcrypt.genSalt(10, (err, salt)=> {
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                       if(err) throw err;
                       newUser.password = hash;

                       newUser.save()
                        .then((data)=>{
                            req.flash("success_msg","用户注册成功");
                            res.redirect("/users/login")
                        }).catch((err)=>{
                            req.flash("error_msg","用户注册失败");
                            res.redirect("/users/register")
                        })
                    });
                });
            }
        })     
    }
})

router.post("/login",urlencodedParser,(req,res,next)=>{
    let errors = [];
    if(!req.body.login_name){
        errors.push({errortip:"请填写用户名"});
    }
    if(!req.body.login_password){
        errors.push({errortip:"请填写密码"});
    }
    if(errors.length>0){
        res.render("users/login",{
            errors:errors,
            name:req.body.login_name,
            password:req.body.login_password
        })
    }else{
        // User.findOne({name:req.body.login_name}).then((user)=>{
        //     if(!user){
        //         req.flash("error_msg","用户不存在");
        //         res.redirect("/users/login");
        //         return false;
        //     }

        //     bcrypt.compare(req.body.login_password, user.password, (err, ress)=> {
        //         if(err) throw err;
        //         if(ress){
        //             req.flash("success_msg","登陆成功");
        //             res.redirect("/ideas");
        //         }else{
        //             req.flash("error_msg","密码错误");
        //             res.redirect("/users/login");
        //         }
        //     });
        // })
        passport.authenticate("local",{
            successRedirect:"/ideas",
            failureRedirect:"/users/login",
            failureFlash:true
        })(req,res,next)
    }
})

module.exports = router;