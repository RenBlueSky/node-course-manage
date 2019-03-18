if(process.env.NODE_ENV == "production"){
    module.exports = {
        base_url:""
    }
}else{
    // 开发环境
    module.exports = {
        base_url:'mongodb://localhost/csdata'
    }
}