const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const router = express.Router();

require("../models/Idea.js");
const Idea = mongoose.model("ideas");

const {enshureAuth} = require("../helpers/auth");

//引入body-parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/",(req,res)=>{
    Idea.find({})
        .sort({date:"desc"})
        .then(ideas=>{
            res.render("ideas/index",{ideas:ideas});
        })
});

// ——》添加页面
router.get("/add",enshureAuth,(req,res)=>{
    res.render('ideas/add')
})

// ——》编辑页面
router.get("/edit/:id",enshureAuth,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        res.render('ideas/edit',{
            idea:idea
        });
    })
})

// 添加
router.post("/",urlencodedParser,(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({tip:'请输入标题'})
    }
    if(!req.body.details){
        errors.push({tip:'请输入详情'})
    }
    if(errors.length>0){
        res.render("ideas/add",{
            errors:errors,
            tipTitle:req.body.title,
            tipDetails:req.body.details
        })
    }else{
        const newCourse = {
            title:req.body.title,
            details:req.body.details
        }
        new Idea(newCourse)
            .save()
            .then((data)=>{
                req.flash("success_msg","数据添加成功");
                res.redirect("ideas")
            })
    }
})

// 编辑
router.put("/:id",urlencodedParser,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea=>{
            req.flash("success_msg","数据编辑成功");
            res.redirect("/ideas");
        })
    })
})

// 删除
router.delete("/:id",(req,res)=>{
    Idea.remove({
        _id:req.params.id
    }).then(idea=>{
        req.flash("success_msg","数据删除成功");
        res.redirect("/ideas");
    })
})

module.exports = router;