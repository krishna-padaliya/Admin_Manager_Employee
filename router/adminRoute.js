const express = require('express')
const admin =  express.Router()
const auth = require("../config/jwtSetup")

const adminCtl = require('../controller/adminCtl')

admin.post('/addAdmin' , adminCtl.addAdmin)
admin.get('/viewAdmin' , adminCtl.viewAdmin)
admin.get('/viewAllData' , adminCtl.viewAllData)
admin.get('/profile/:id' , adminCtl.profile)
admin.post('/adminLogin' , adminCtl.adminLogin)
admin.post('/changePass' , adminCtl.changePass)
admin.post("/forgetPass", adminCtl.forgetPass);

const multer = require("multer");

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    }
})

const upload = multer({ storage: Storage }).single("image");

admin.post('/managerRegistration',upload, adminCtl.managerRegistration)
admin.get('/viewManager' , adminCtl.viewManager)
admin.delete('/deleteManager/:id', adminCtl.deleteManager)

module.exports = admin