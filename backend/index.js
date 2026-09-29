const express=require("express");

const UserRouter=require("./router/UserRouter");
const snippetRouter=require("./router/snippetRouter");
require('./connection');
const cors = require('cors');

const app=express();

const port=5000;

//middleware
app.use(cors({
    origin:'http://localhost:3000'
}));
app.use(express.json());
 app.use('/snippet',snippetRouter);
app.use("/user",UserRouter);

app.get("/",(req,res)=>{
    res.send("response from the server");
});

app.get("/add",(req,res)=>{
    res.send("response from add");
});

app.get("/getall",(req,res)=>{
    res.send("response from getall");
});


app.get("/update",(req,res)=>{
    res.send("response from update");
});


app.get("/delete",(req,res)=>{
    res.send("response from delete");
});

//start the server
app.listen(port, ()=>{
    console.log("server started");
});