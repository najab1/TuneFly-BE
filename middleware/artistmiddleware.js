const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
module.exports = {

    updateManageProfile: async function updateManageProfile(data, type) {
        if (type === "instagram") {
            const updatedata = await prisma.manageartistprofile.update({
                where: { userId: data.userId },
                data: {
                    instagram: data.link,
                    updated_At: new Date()
                }
            })
            return updatedata
        } else if (type === "twitter") {
            const updatedata = await prisma.manageartistprofile.update({
                where: { userId: data.userId },
                data: {
                    twitter: data.link,
                    updated_At: new Date()
                }
            })
            return updatedata
        }
        else if (type === "tiktok") {
            const updatedata = await prisma.manageartistprofile.update({
                where: { userId: data.userId },
                data: {
                    tiktok: data.link,
                    updated_At: new Date()
                }
            })
            return updatedata
        } else if (type === "spotify") {
            const updatedata = await prisma.manageartistprofile.update({
                where: { userId: data.userId },
                data: {
                    spotify: data.link,
                    updated_At: new Date()
                }
            })
            return updatedata
        } else if (type === "apple") {
            const updatedata = await prisma.manageartistprofile.update({
                where: { userId: data.userId },
                data: {
                    apple: data.link,
                    updated_At: new Date()
                }
            })
            return updatedata
        } else if (type === "soundcloud") {
            const updatedata = await prisma.manageartistprofile.update({
                where: { userId: data.userId },
                data: {
                    soundcloud: data.link,
                    updated_At: new Date()
                }
            })
            return updatedata
        } else {
            return null
        }
    },

    checkApprovelStatus:async function checkApprovelStatus(data) {
        const check = await prisma.userartistprofile.findUnique({
            where:{
                userId:data.userId,
            },
            select:{
                approvel:true
            }
        }) 
        if(check.approvel){
            return true
        }else{
            throw ("Sorry,you are not approvel on this time.")
        }
    }

}