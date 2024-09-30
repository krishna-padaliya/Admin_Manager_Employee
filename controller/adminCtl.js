// admin 
const adminSchema = require('../model/adminSchema')
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
let mailer = require("../config/mailer")  
const fs = require("fs");
// register 
const registerSchema = require('../model/registration')  
const EmployeRegisterSchema = require('../model/employeSchema') 

module.exports.addAdmin = async (req,res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.createdAt = moment().format('DD-MM-YYYY, h:mm:ss a');
    let data = await adminSchema.create(req.body)
    data ? res.status(200).json({msg: "Admin Added SuccesFully!!"}) : res.status(400).json({msg: "Admin Not Added, Try Again"})
}

module.exports.viewAdmin = async (req,res) => {
    let data = await adminSchema.find();
    data ? res.status(200).json({msg: "Admin Founded!!" , data: data}) : res.status(400).json({msg: "Admin Not Found, Try Again"})
}

module.exports.viewAllData = async (req,res) => {
    let managerData = await registerSchema.find();
    let EmployeeData = await EmployeRegisterSchema.find();
    managerData ? res.status(200).json({msg: "Manager Founded!!" , managerData: managerData}) : res.status(400).json({msg: "Manager Not Found, Try Again"})
    EmployeeData ? res.status(200).json({msg: "Employee Founded!!" , EmployeeData: EmployeeData}) : res.status(400).json({msg: "Employee Not Found, Try Again"})
}

module.exports.adminLogin = async (req,res) => {
    let data = await adminSchema.findOne({email: req.body.email })
    if(data) {
        if(await bcrypt.compare(req.body.password, data.password)) {
            let token = jwt.sign({data: data}, "AdminKey", { expiresIn: "1h" })
            res.status(200).json({ msg: "passwrod is right", adminToken: token })
        }
        else{
            res.status(400).json({ msg: "passwrod is wrong" })
        }
    }
    else {
        res.status(400).json({ msg: "admin not found" })
    }
}

module.exports.profile = async(req,res) => {
    let profile = await adminSchema.findById(req.params.id);
    // console.log(profile);
    profile ? res.status(200).json({ msg: "response found", profile: profile }) : res.status(400).json({ msg: "data not found" })
}

module.exports.changePass = async(req,res) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    if(await bcrypt.compare(req.body.oldPass, req.user.data.password)) {
        if(req.body.newPass == req.body.conPass){
            let bPass = await bcrypt.hash(req.body.newPass, 10);
            let change = await adminSchema.findByIdAndUpdate(req.user.data._id, { password: bPass })
        }
        else{
            res.status(400).json({ msg: "new password and confirm password must be same" })
        }
    }
    else{
        res.status(400).json({ msg: "password is wrong" })
    }
}

module.exports.forgetPass = async (req, res) => {
    let data = await adminSchema.findOne({ email: req.body.email });

    if (!data) {
        return res.status(400).json({ msg: "admin email is wrong" })
    }

    let otp = Math.floor(Math.random() * 100000 + 900000);
    mailer.adminOtp(req.body.email, otp);

    res.cookie("otp", otp);
    res.cookie("adminId", data._id)

    res.status(200).json({ msg: "otp is sended to your email" })
}

// manager 
module.exports.managerRegistration = async (req,res) => {
     let user = await registerSchema.findOne({ email: req.body.email });
    if (user) {
        return res.status(200).json({ msg: "Mangaer already registerd" })
    }
    req.body.image = req.file.path
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    let userData = await registerSchema.create(req.body);
    userData ? res.status(200).json({ msg: "Manager registerd" }) : res.status(400).json({ msg: "something went wrong" })
}

module.exports.viewManager = async (req,res) => {
    let data = await registerSchema.find({});
    data ? res.status(200).json({ msg: "response found", Manager: data }) : res.status(400).json({ msg: "data not found" })
}

module.exports.deleteManager = async (req,res) => {
    console.log(req.params.id);
    let singleData = await registerSchema.findById(req.params.id);
    console.log(singleData);

    fs.unlinkSync(singleData.image);
    let data = await registerSchema.findByIdAndDelete(req.params.id)
    data ? res.status(200).json({ msg: "Mangaer data deleted" }) : res.status(400).json({ msg: "Manager data not deleted" })
}