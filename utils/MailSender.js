const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: "cesar.barahona031@gmail.com",
      pass: process.env.NODEMAILER_PASS
    }
});

const SENDER = "cesar.barahona031@gmail.com"

function SendGMail(email, otp){

    const text = `Hi, ${email},
    <br> <h2> Welcome To Tune App.</h2><br>
    <p><h1>${otp}</h1></p>
    <br> please use code for verified, and start using our (amazing) app. <br>

    <br>Sincerely,
    <br>TuneFly`;

    const mailOptions = {
        from: SENDER,
        to: email,
        subject: 'Your Activation Code is Here',
        html: text
    };
    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err){
            console.log(err)
        }
        else{
            // console.log(info);
        }
    });
}

module.exports={
    SendGMail,
}