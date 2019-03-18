module.exports = {
    enshureAuth:(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","请先登录");
        res.redirect("/users/login");
    }
}