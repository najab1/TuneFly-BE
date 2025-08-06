const { PrismaClient } = require('@prisma/client');
const { generateRandomNumber } = require('./authmiddleware');
const { SendGMail } = require('../utils/MailSender');
const prisma = new PrismaClient()


async function OTPGenerate(data,uuid) {
    const OTP = await generateRandomNumber()
      const generateotp = await prisma.otp.create({
        data:{
            uuid:uuid,
            email:data.email,
            otp:OTP
        }
        })
        await SendGMail(data.email,OTP)
      return generateotp    
}
async function OTPUpdate(data) {
  const OTP = await generateRandomNumber()
    const generateotp = await prisma.otp.update({
      where:{
          email:data.email
      },
      data:{
          otp:OTP,
          updated_At:new Date()
      }
    })
    await SendGMail(data.email,OTP)
    return generateotp    
}


module.exports ={
    OTPGenerate,
    OTPUpdate
}