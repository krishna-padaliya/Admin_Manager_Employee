const mongoose = require("mongoose");

const EmployeRegisterSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    hobby:{
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
})

const registetedSchema = mongoose.model("EmployeRegister", EmployeRegisterSchema)

module.exports = registetedSchema