const { PrismaClient } = require('@prisma/client');
const { generateToken, verifyToken, checkUserName, createUserProfile, generateRandomNumber } = require('../middleware/authmiddleware');
const uuidv4 = require('uuid').v4;
const { OTPGenerate, OTPUpdate } = require('../middleware/otpmiddleware');
const utils = require('../utils/createHashPassword');

const prisma = new PrismaClient()

module.exports = {
    //signup
    signup:async function signup(data) {
    const uuid = uuidv4();
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUserEmail) {
            throw ('Email already exists');
        }
        const existingUserName = await checkUserName(data)
        if (existingUserName) {
            throw ('Username  already exists');
        }

        const hashedPassword = utils.createHash(data.password)

        if (!hashedPassword) {
            throw ("Error creating new user password")
        }
        if(data?.usertype && data?.usertype?.toLowerCase() === "driver"){
            const availableQrCode = await prisma.qrcode.findMany({
                where: {
                    userId: null,
                },
            })
            if (availableQrCode.length) {
                await prisma.qrcode.update({
                  where: { id: availableQrCode[0].id },
                  data: { userId: uuid }, 
                });
            }else{
                throw ("No available QR code IDs to assign. Please try again later.")
            }
        }
      
        const createUser = await prisma.user.create({
            data: {
                uuid: uuid,
                email: data.email,
                password: hashedPassword,
                usertype: data.usertype,
            },
            select: {
                uuid: true, email: true
            }
        })
      

        const userProfileCreate = await createUserProfile(data, uuid)
        const otp = await OTPGenerate(data, uuid)
        if (createUser && userProfileCreate && otp) {
            return "Account create successfully && Otp send"
        }
    } catch (error) {
        throw error
    }


},

//verifyemail
VerifyEmail:async function VerifyEmail(data, otp) {
    try {

        const existingUserEmail = await prisma.otp.findUnique({
            where: { email: data.email },
        });
        if (!existingUserEmail) {
            throw ('Email not found');
        }
        const OtpCheck = await prisma.otp.findFirst({
            where: {
                AND: [
                    { email: data.email, otp: Number(otp) }
                ]
            }
        })
        if (OtpCheck) {
            const updateStatusVerify = await prisma.user.update({
                where: { email: data.email },
                data: { verify_email: true, updated_At: new Date() },
            })
            const deteteOtp = await prisma.otp.delete({
                where: {
                    email: data.email
                }
            })
            if (deteteOtp && updateStatusVerify) {
                if (data.value) {
                    return updateStatusVerify
                }
                return ("Verification Successfull")
            }

        } else {
            throw ("Otp invalid")
        }



    } catch (error) {
        throw error
    }


},

//login
login:async function login(data) {
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!existingUserEmail) {
            throw ('Email not found');
        }
        const hashedPassword = await utils.isValidPassword(data.password, existingUserEmail?.password)
        if (!hashedPassword) {
            throw ('password is not valid')
        }
        if (existingUserEmail.usertype != data.usertype) {
            throw (`${data.usertype} not found`)
        }
        if (existingUserEmail.verify_email == false) {
            OTPUpdate(data)
            throw ('Email is not verified')
        }

       


        const token = await generateToken(existingUserEmail)
        if (data.usertype == "artist") {
            const userdata = await prisma.user.findUnique({
                where: {
                    uuid: existingUserEmail.uuid,
                },
                include: {
                    UserArtistProfile: true
                }
            })

            return { "user": userdata, "token": token }
        } else if (data.usertype == "driver") {
            const userdata = await prisma.user.findUnique({
                where: {
                    uuid: existingUserEmail.uuid,
                },
                include: {
                    UserDriverProfile: true
                }
            })
            return { "user": userdata, "token": token }
        }else{
            return { "user": existingUserEmail, "token": token }
        }



    } catch (error) {
        throw error
    }


},

//forgetpassword
forgetpassword:async function forgetpassword(data) {
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!existingUserEmail) {
            throw ('Email not found');
        }
        if (existingUserEmail.usertype != data.usertype) {
            throw (`${data.usertype} not found`)
        }

        const check = await prisma.otp.findFirst({ where: { email: data.email } })

        if (check) {
            const otp = await OTPUpdate(data)
            if (otp) {
                return "Otp send successfull"
            }
        } else {
            const otp = await OTPGenerate(data, existingUserEmail.uuid)
            if (otp) {
                return "Otp send successfull"
            }
        }
    } catch (error) {
        throw error
    }


},

//setPassowrd
setpassword: async function setpassword(data) {
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: data.email, usertype: data.usertype },
        });

        if (!existingUserEmail) {
            throw ('User not found');
        }

        const hashedPassword = utils.createHash(data.password)

        if (!hashedPassword) {
            throw ("Error creating new user password")
        }
        const updateuserdata = await prisma.user.update({
            where: {
                uuid: existingUserEmail.uuid
            },
            data: {
                password: hashedPassword,
                updated_At: new Date()
            }
        })
        if (updateuserdata) {
            return "set password successfull"
        }
    } catch (error) {
        throw error
    }
},

//otpsend
otpSend: async function otpSend(data) {
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });
        if (!existingUserEmail) {
            throw ('Email not found');
        }
        const generateotp = await OTPUpdate(data)
        if (generateotp) {
            return "Otp send successfull"
        }
    } catch (error) {
        throw error
    }

},

//logout
logout: async function logout(data) {
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!existingUserEmail) {
            throw ('Email not found');
        }
        return "Logout successfully!"

    } catch (error) {
        throw error
    }
},

//deleteAccount
deleteAccount: async function deleteAccount(data) {
    try {
        const existingUserEmail = await prisma.user.findUnique({
            where: { uuid: data.userId },
        });
        if (!existingUserEmail) {
            throw ('User not found');
        }
        await prisma.user.update({
            where:{uuid:data.userId},
            data:{
                email:existingUserEmail.uuid
            }
        })
        return "Delete Account successfully!"

    } catch (error) {
        console.log("er",error)
        throw error
    }
}

}