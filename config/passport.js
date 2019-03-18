const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 加载model 
require("../models/Users.js");
const User = mongoose.model("user");

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:"name"},(name,password,done) => {
            console.log(name)
            console.log(password)
            User.findOne({name:name}).then((user)=>{
                if(!user){
                   return done(null,false,{message:"没有此用户"})
                }
    
                bcrypt.compare(password, user.password, (err, isMatch)=> {
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user)
                    }else{
                        return done(null,false,{message:"密码错误"})
                    }
                });
            })
        }
      )); 
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
       
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
}