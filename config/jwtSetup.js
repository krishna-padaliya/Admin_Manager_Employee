const jwt = require("jsonwebtoken")
const adminSchema = require('../model/adminSchema')

const auth = (req, res, next) => {
    let token = req.header("Authentication")

    if(!token){
        return res.status(401).json({ msg: "token invalid" })
    }

    let newToken = token.slice(7, token.length)

    let decode = jwt.verify(newToken, "AdminKey")
    // console.log(decode);
    req.user = decode
    next();
}

module.exports = auth;