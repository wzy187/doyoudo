var express = require('express');
var router = express.Router();
var db = require('../../database/db');


//登录
router.get("/login", (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var username = req.query.username;
    var userpwd = req.query.userpwd;
    var data = {};
    var sql = "select * from users where username='" + username + "'and userpwd='" + userpwd + "'";
    db.query(sql, function (error, users) {
        if (!error && users.length > 0) {
            data.user = users[0];
            res.json(data);
            console.log(data);
        }else {
            console.log("asdasd");
        }
    })
})

//注册
router.get("/register", (req, res) => {
    var username = req.query.username;
    var userpwd = req.query.userpwd;
    var email = req.query.email;
    var data = {};
    var sql = "insert into users(username,userpwd,email) values (?,?,?)";
    var params = [username, userpwd, email];
    db.query(sql, params,function (error, users) {
        if (!error && users.insertId > 0) {
            data.user = users;
            res.json(data);
        } else {
            console.log("注册出错");
        }
    });
})

//分类1
router.get("/category", (req, res) => {
    var sql = "select * from two_category";
    db.query(sql, function (error, results) {
        if (!error && results.length>0) {
            var data = {
                data: results
            }
            res.json(data);
            console.log("分类1");
        } else {
            console.log("分类1错误");
        }
    })
})


//分类2
router.get("/two_category",(req,res)=>{
    var tid = req.query.id;
    var sql = "select * from three_category where tid="+tid;
    db.query(sql,function(error,result){
        if(!error && result.length>0){
            var data = {
                data:result
            }
            res.json(data);
            console.log("获取分类2");
        }else{
            console.log("获取分类2错误");
            res.json(data);
        }
    })
})

//分类全部
router.get("/all_content", (req, res) => {
    var sql = "select * from course";
    db.query(sql, function (error, results) {
        if (!error && results.length>0) {
            var data = {
                data: results
            }
            res.json(data);
            console.log("全部");
        } else {
            console.log("错误");
        }
    })
})
//分类3
router.get("/three",(req,res)=>{
    var tid = req.query.tid;
    var sql = "select * from course where dgs="+tid;
    console.log(sql)
    db.query(sql,function (error,result) {
        if (!error && result.length>0){
            var data = {
                data:result
            }
            res.json(data)
            console.log("分类3")
        }
    })
})
//搜索
router.get("/search", (req, res) => {
    var data ={}
    var ss = req.query.search;
    var sql = "select * from course where cname like '%" + ss + "%'";
    db.query(sql, function (error, results) {
        if (!error && results.length>0) {
            data.results = results
            res.json(data);
            console.log("搜索");
        } else {
            console.log("搜索错误");
        }
    })
});
//个人信息修改
router.get("/alter", (req, res) => {
    var data ={}
    var username = req.query.username;
    var userpwd = req.query.userpwd;
    var email = req.query.email;
    var bday = req.query.bday;
    var aid = req.query.id;
    var sql = "update users set username=?,userpwd=?,email=?,bday=? where id="+aid;
    var params = [username,userpwd,email,bday]
    db.query(sql,params ,function (error, results) {
        if (!error && results.affectedRows>0) {
            data = {
                type:"success",
                type_code:200,
                message:'修改成功,请重新登陆'
            }
            res.json(data)
            console.log("成功")
        } else {
            data = {
                type:"success",
                type_code:600,
                message:'修改失败'
            }
            res.json(data)
            console.log("修改失败");
        }
    })
});
//课程详情
router.get('/show',(req,res)=>{
    var data = {};
    var cid = req.query.id;
    var sql = "select * from course where id="+cid;
    db.query(sql,function (error,result) {
        if(!error && result.length>0){
            data.course = result[0]
            res.json(data)
        }
    })
})
//添加到购物车
router.get('/addcart',(req,res)=>{
    var user_id = req.query.user_id;
    var course_id = req.query.course_id;
    var sql = "select * from cart where course_id="+course_id+' and user_id='+user_id;
    db.query(sql,function (error,result) {
        if(!error && result.length>0) {
            var data = {};
            var uid = req.query.user_id;
            var cid = req.query.course_id;
            var sqll = "update cart set num=num+1 where course_id="+cid + ' and user_id='+uid;
            console.log(sqll)
            db.query(sqll, function (error, results) {
                if (!error && results.affectedRows>0) {
                    data = {
                        type: "success",
                        type_code: 200,
                        message: "再次添加成功，购买请到我的课程>课程购物车查看"
                    }
                    res.json(data)
                    console.log("再次添加成功")
                } else {
                    data = {
                        type: "warning",
                        type_code: 600,
                        message: '再次添加失败'
                    }
                    res.json(data)
                    console.log("再次添加失败")
                }
            })
        }else if(!error && result.length<1){
            var data = {};
            var user_id = req.query.user_id;
            var course_id = req.query.course_id;
            var img = req.query.img;
            var price = req.query.price;
            var cname = req.query.cname;
            var num = 1;
            var sql = "insert into cart (user_id,course_id,img,price,cname,num) values (?,?,?,?,?,?)";
            var params = [user_id,course_id,img,price,cname,num];
            db.query(sql,params,function(error,results){
                if(!error && results.insertId>0){
                    data = {
                        type:"success",
                        type_code:200,
                        message:"添加成功，购买请到我的课程>课程购物车查看"
                    }
                    res.json(data)
                    console.log("添加购物车成功")
                }else{
                    data = {
                        type:"warning",
                        type_code:600,
                        message:'添加失败'
                    }
                }
            })
        }else {
            console.log("出错")
        }
    })
})
//购物车查询
router.get("/scq", (req, res) => {
    var uid = req.query.user_id;
    var sql = "select * from cart where user_id="+uid;
    db.query(sql, function (error, results) {
        if (!error && results.length>0) {
            var data ={

            }
            data.scart = results;
            res.json(data);
            console.log("购物车查询成功");
        } else {
            console.log("???错误");
        }
    })
})
//购物车数量加
router.get('/addt',(req,res)=>{
    var uid = req.query.user_id;
    var cid = req.query.cid;
    var sql = "update cart set num=num+1 where id="+cid+' and user_id='+uid;
    db.query(sql,function (error,result) {
        if(!error && result.affectedRows>0){
            console.log("数量加成功")
            res.json({
                code:200
            })
        }else{
            res.json({
                code:404
            })
            console.log("数量加失败")
        }
    })

})
//购物车数量减
router.get('/minuscart',(req,res)=>{
    var cid = req.query.cid;
    var sql = "update cart set num=num-1 where id="+cid;
    db.query(sql,function (error,result) {
        if(!error && result.affectedRows>0){
            console.log("数量减成功")
            res.json({
                code:200
            })
        }else{
            res.json({
                code:404
            })
            console.log("数量减失败")
        }
    })

})
//购物车小于1删除
router.get('/qdelete',(req,res)=>{
    var uid = req.query.user_id
    var cid = req.query.cid;
    var sql = "delete from cart where id="+cid+' and user_id='+uid;
    db.query(sql,function(error,results){
        if (!error && results.affectedRows>0){
            res.json({
                code:200,
                message:"删除成功"
            })
            console.log("删除成功")
        }
    })
})
//单个购买
router.get("/sbuy",(req,res)=>{
    var cid = req.query.cid;
    var user_id = req.query.user_id;
    var cname = req.query.cname;
    var img = req.query.img;
    var price = req.query.price;
    var num = req.query.num;
    var sql = "insert into mycourse (cid,user_id,cname,price,img,num) values (?,?,?,?,?,?)";
    var params = [cid,user_id,cname,price,img,num];
    db.query(sql,params,function (error,result) {
        if (!error && result.insertId>0){
            res.json({
                code:200,
                message:"购买成功"
            })
            var uid = req.query.user_id
            var cid = req.query.cid;
            var sql = "delete from cart where id="+cid+' and user_id='+uid;
            db.query(sql,function(error,results){
                if (!error && results.affectedRows>0){
                    res.json({
                        code:200
                    })
                    console.log("删除成功")
                }
            })
        }
    })

})

//已购课程
router.get('/csbuy',(req,res)=>{
    var user_id = req.query.user_id;
    var data = {};
    var sql = "select * from mycourse where user_id="+user_id;
    db.query(sql,function (error,result) {
        if (!error && result.length>0){
            data.cscart = result;
            res.json(data)
            console.log(data)
        }

    })
})
module.exports = router;
