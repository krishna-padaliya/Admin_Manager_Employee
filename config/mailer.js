const mailer = require("nodemailer");

const transpoter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: "krishnapadaliya011@gmail.com",
        pass: "zceovipcwsruurmm"
    }
})

module.exports.adminOtp = (to, otp) => {
    let mailOption = {
        to: to,
        from: "krishnapadaliya011@gmail.com",
        subject: "Forget password otp",
        text: `you otp is ${otp}`
    }
    transpoter.sendMail(mailOption, (err) => {
        err && console.log(err);
    })
}

module.exports.managerPass = (to, email, pass) => {
    let mailOption = {
        to: to,
        from: "",
        subject: "your password and email",
        text: `your email is ${email} and your password for this is ${pass}`
    }
}
