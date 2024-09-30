const express = require('express')
const manager =  express.Router()
const auth = require("../config/jwtSetup")

const managerCtl = require('../controller/managerCtl')

manager.post('/managerLogin' , managerCtl.managerLogin)
manager.get('/viewManager' , managerCtl.viewManager)
manager.post("/managerForgetPass", managerCtl.managerForgetPass);
manager.post('/managerChangePass' , managerCtl.managerChangePass)

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

manager.post('/employeRegistration',upload, managerCtl.emplyeRegistration)
manager.get('/viewEmploye' , managerCtl.viewEmploye)
manager.delete('/deleteEmploye/:id', managerCtl.deleteEmploye)

module.exports = manager