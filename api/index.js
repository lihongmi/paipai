const express=require("express");
const http=require("http");
const bodyParser=require("body-parser");
const jwt=require("jsonwebtoken");
const multer  = require('multer');
const fs=require('fs');
const path=require("path");

const secret_key="paipai";

var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));


//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get("/",function(req,res){
    res.json({text:"welcome to paipai api"});
});

app.post("/login",function(req,res){    
    
    var {name,pwd}=req.body;

    if(name=="sgj"&&pwd=="123456"){
        var user={uid:3};
        var token=jwt.sign({user},secret_key);
        res.json({token:token});
    }else{
        res.json({text:"获取token失败"});
    }

   
});

app.get("/list",ensureToken,function(req,res){

    var token=req.token;
    console.log(req.token);

    jwt.verify(token,secret_key,function(err,data){
        if(err){
            res.json({err});
           // res.sendStatus(403);
        }else{

            res.json({
                status:1,
                message:"请求成功",
                data:[
                    {title:"前端css面试题1",miaosu:"前端css面试题1XXXX",zuozhe:"前端mm",time:"28分钟前"},
                    {title:"前端css面试题2",miaosu:"前端css面试题2YYYY",zuozhe:"前端gg",time:"3分钟前"}
                ]
            });
        }  

    })
   
});


var storage = multer.diskStorage({
//设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    }, 
//给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});  
//var upload = multer({ dest: './public/uploads/' })
var upload = multer({
    storage: storage,
    limits:{}
});

app.post('/postimg',  upload.single('pic'),function(req, res, next) {
//router.post('/post_img1',  upload.array('avatar',3),function(req, res, next) {
//router.post('/post_img1', upload.fields([{ name: 'avatar', maxCount: 2}, { name: 'avatar1', maxCount: 1 }]),function(req, res, next) {
    //res.send(req.file);

});

app.post('/postpic',upload.single('pic'),function(req, res, next) {
    //var base64Data=req.body.pic.replace(/^data:image\/png;base64,/,'');
    //图片类型
    var typeReg=/^data:image\/(png|jpeg|jpg);base64/;
    var head=req.body.pic.split(",")[0];
    var fType="png";
    if(head){
        var result=head.match(typeReg);
        fType=result[1];
        if(fType=="jpeg"){
            fType="jpg";
        }
    }
     //图片数据
    var base64Data = req.body.pic.split(",")[1];
    var binaryData=new Buffer(base64Data,'base64').toString('binary');



    //给上传文件重命名，获取添加后缀名
    var filePath='./public/uploads/';
    var filename=  Date.now() + "." + fType;

    fs.writeFile(filePath+filename,binaryData,'binary',function(err){
    
        if(err){
            res.json({
                err
            });
        }
        res.json({
            picUrl:'http://192.168.0.115/uploads/'+filename,
            msg:"上传成功!"
        });
    });
    
});



function ensureToken(req,res,next){
    const bearerHeader=req.headers["authorization"];

    if(typeof bearerHeader!="undefined"){
        var bearer=bearerHeader.split(" ");
        var bearerToken=bearer[1];
        req.token=bearerToken;
   
        next();
    }else{
        res.sendStatus("403");
    }
}


var server = http.createServer(app);
server.listen(80);
server.on('listening', function(){
    console.log("服务已启动");
});

  