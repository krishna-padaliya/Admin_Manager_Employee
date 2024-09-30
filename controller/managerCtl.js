// admin 
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
let mailer = require("../config/mailer")  
const fs = require("fs");
// register 
const registerSchema = require('../model/registration')
const EmployeRegisterSchema = require('../model/employeSchema')  


module.exports.managerLogin = async (req,res) => {
    let data = await registerSchema.findOne({email: req.body.email })
    if(data) {
        if(await bcrypt.compare(req.body.password, data.password)) {
            let token = jwt.sign({data: data}, "AdminKey", { expiresIn: "1h" })
            res.status(200).json({ msg: "Manager Login Succesfully", adminToken: token })
        }
        else{
            res.status(400).json({ msg: "passwrod is wrong" })
        }
    }
    else {
        res.status(400).json({ msg: "Manager not found" })
    }
}

module.exports.viewManager = async (req,res) => {
    let data = await registerSchema.find();
    data ? res.status(200).json({msg: "Manager Founded!!" , data: data}) : res.status(400).json({msg: "Manager Not Found, Try Again"})
}

module.exports.managerForgetPass = async (req,res) => {
    let data = await registerSchema.findOne({ email: req.body.email });

    if (!data) {
        return res.status(400).json({ msg: "Manager email is wrong" })
    }

    let otp = Math.floor(Math.random() * 100000 + 900000);
    mailer.adminOtp(req.body.email, otp);

    res.cookie("otp", otp);
    res.cookie("ManagerId", data._id)

    res.status(200).json({ msg: "otp is sended to your email" })
}

module.exports.managerChangePass = async (req,res) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    if(await bcrypt.compare(req.body.oldPass, req.user.data.password)) {
        if(req.body.newPass == req.body.conPass){
            let bPass = await bcrypt.hash(req.body.newPass, 10);
            let change = await registerSchema.findByIdAndUpdate(req.user.data._id, { password: bPass })
        }
        else{
            res.status(400).json({ msg: "new password and confirm password must be same" })
        }
    }
    else{
        res.status(400).json({ msg: "password is wrong" })
    }
}

module.exports.emplyeRegistration = async(req,res) => 
{
    let user = await EmployeRegisterSchema.findOne({ email: req.body.email });
    if (user) {
        return res.status(200).json({ msg: "Employee already registerd" })
    }
    req.body.image = req.file.path
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    let userData = await EmployeRegisterSchema.create(req.body);
    userData ? res.status(200).json({ msg: "Employee registerd" }) : res.status(400).json({ msg: "something went wrong" })
}

module.exports.viewEmploye = async (req,res) => {
    let data = await EmployeRegisterSchema.find({});
    data ? res.status(200).json({ msg: "response found", Manager: data }) : res.status(400).json({ msg: "data not found" })
}

module.exports.deleteEmploye = async (req,res) => {
    console.log(req.params.id);
    let singleData = await EmployeRegisterSchema.findById(req.params.id);
    console.log(singleData);

    fs.unlinkSync(singleData.image);
    let data = await EmployeRegisterSchema.findByIdAndDelete(req.params.id)
    data ? res.status(200).json({ msg: "Employee data deleted" }) : res.status(400).json({ msg: "Employee data not deleted" })
}