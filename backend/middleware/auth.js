const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth =(req,res,next) =>{
    const token =req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(400).json({ message: 'token not found'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,decode) =>{
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else{
            req.user = decode;
            next();
        }
    })
};
module.exports = auth;