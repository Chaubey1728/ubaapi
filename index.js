const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
require(".")
const bcrypt = require('bcrypt');
require('dotenv').config();

require("./db/database");
const Register = require("./models/register");

app.use(express.json());

const jwt = require('jsonwebtoken');
const jwtkey= process.env.KEY;

app.get("/register",(req,res)=>{
    res.send('api working')
})

app.post("/register", async (req, res) => {
    let users= new Register(req.body);

    let result = await users.save();
    jwt.sign({result}, jwtkey, {expiresIn: "1h"}, (err,token)=>{
        if(err){
            res.send({result : "something went wrong"})
        }

        res.send({result, auth: token})
    })
})

app.post("/login", async (req,res)=>{
    
    const {email, password } = req.body;

    if (req.body.password && req.body.email){

    const user = await Register.findOne({email:email});
    const matchpassword = await bcrypt.compare(user.password,password);
    if (user) {

            jwt.sign({user}, jwtkey, {expiresIn: "1h"}, (err,token)=>{
                if(err){
                    res.send({result : "something went wrong"})
                }
                
                res.send({user, auth: token})
            })
        }else{
            res.send({result:" No user found "})
        }
    }else{
        res.send({Result: "No user Found"})
    }

    
});


function verifyToken(req ,res ,next){
    let token = req.headers['Authorization'];
    if (token){
        token = token.split(' ')[1] ;
        jwt.verify(token, jwtkey, (err,valid)=>{
            if (err){
                res.status(401).send({result:"Please provide token"})
            }else{
                next();
            }
        })
    }else {
        res.status(403).send({result:"Please add token with header"})
    }

    
}

if (process.env.NODE_ENV == 'production') {
    app.use(express.static("ubafront/build"));
}

const port = process.env.PORT || 5000 ;
app.listen(port);

