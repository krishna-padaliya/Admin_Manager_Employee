const express = require('express')
const employe =  express.Router()
const auth = require("../config/jwtSetup")

const employeCtl = require('../controller/employeCtl')

employe.post('/employeLogin' , employeCtl.employeLogin)
employe.post("/employeForgetPass", employeCtl.employeForgetPass);
employe.post('/employeChangePass' , auth, employeCtl.employeChangePass)


module.exports = employe