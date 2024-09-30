const express = require('express')
const port = 6000

const app = express()
const db = require('./config/databse')

app.use(express.urlencoded())
app.use('/admin' , require('./router/adminRoute'))
app.use('/manager', require('./router/managerRoute'))
app.use('/employee', require('./router/employeRoute'))

app.listen(port ,(err)=>{
    err ? console.log('SErver Not Responding!!') : console.log('Server Responding at:' + port);
})