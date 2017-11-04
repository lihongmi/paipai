const express=require("express");
const http=require("http");
const bodyParser=require("body-parser");
const jwt=require("jsonwebtoken");
const secret_key="paipai";

var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



app.get("/",function(req,res){
    res.json({text:"welcome to paipai api"});
});

app.post("/login",function(req,res){    
   
    var {name,pwd}=req.body;
    if(name=="rice"&&pwd=="123"){
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
                text:"this is protected",
                data:data
            });
        }  

    })
   
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

  