const { PrismaClient } = require('@prisma/client');
const uuidv4 = require('uuid').v4;
const { checkUserName, updateUserProfile, uploadAvatar, generateToken } = require('../middleware/authmiddleware');
const { createHash, isValidPassword } = require('../utils/createHashPassword');
const { uploadavatar } = require('../utils/imageUpload');
const prisma = new PrismaClient()
module.exports={
//userchel
userChecK:async function userChecK(data) {
    try{
        const usercheck = await prisma.user.findFirst({
            where:{uuid:data.userId}
        })
        if(!usercheck){
            throw("User not exist")
        }else{
            return usercheck
        }
    }catch(error){
        throw error
    }
   
},

//driverdata
driverdata: async function driverdata(data) {
    try{
        const userCheck = await prisma.user.findFirst({
            where:{uuid:data.userId}
        })
        if(!userCheck){
            throw("User not exist")
        }
        const check = await prisma.driveruserlicense.findFirst({
            where:{userId:userCheck?.uuid}
        })
        if(check){
            throw("Sorry already exist && please update the documents")
        }
        const createdata = await prisma.driveruserlicense.create({
            data:{
                userId:userCheck?.uuid,
                media:data.media,
                license:data.license
            }
        })
        const updatedata = await prisma.user.update({
            where:{uuid:data.userId},
            data:{step_one:true},
            include:{
                "UserDriverProfile":true
            }
        })
        if(createdata && updatedata){
            const token = await generateToken(updatedata)
            return { "user": updatedata, "token": token }
        }
    } catch (error) {
        throw error
    }
},

//artistlibraryapprovel
artistLibraryApprovel:async function artistLibraryApprovel(data) {
    const uuid = uuidv4();
    try{
        const createdata = await prisma.artistlibraryApprovel.create({
            data:{
                uuid:uuid,
                userId:data.userId,
                media:data.media,
                artistname:data.artistname,
                genre:data.genre,
            }
        })
        if(createdata){
            const update = await prisma.user.update({
                where:{uuid:data.userId},
                data:{
                    step_one:true
                },
                include:{
                    "UserArtistProfile":true
                }
                
            })
            const token = await generateToken(update)
            return { "user": update, "token": token }
        }else{
            throw "Sorry this time not accept"
        }
    } catch (error) {
        throw error
    }
},
//artistlibraryapprovel
artistdata:async function artistdata(data) {
    const uuid = uuidv4();
    try{
        
        const createdata = await prisma.artistlibrary.create({
            data:{
                uuid:uuid,
                userId:data.userId,
                media:data.media,
                artistname:data.artistname,
                genre:data.genre,
                songname:data.songname,
                country:data.country,
                coverart:data.cover,
                subscription:true
            }
        })
        const create = await prisma.subscription.create({
            data:{
                musicId:uuid,
                budgetplan:data.budgetplan,
                budgetamount:data.budgetamount,
                startDateTime:data.startDateTime,
                endDateTime:data.endDateTime
            }
        })
        const amountValue = parseFloat(data.budgetamount);
        await prisma.compaign.create({
            data: {
                musicId: uuid,
                amount: Number(0)
            }
        })
        const createadminearning = await prisma.adminearning.create({
            data:{
                userId:data.userId,
                amount:amountValue,
            }
        })
        if(createdata && create){
            return createdata
        }else{
            throw "Sorry not created this time."
        }
    } catch (error) {
        console.log("Er",error)
        throw error
    }
},


//updateUser
updateprofile:async function updateprofile(data) {
    try{
        const existingUserName = await checkUserName(data)
        if (existingUserName?.userId != data?.userId && existingUserName?.username===data.username) {
            throw ('Username  already exists');
        }
        const updateprofiledata = await updateUserProfile(data)
        if(updateprofiledata){
            return updateprofiledata
        }
    } catch (error) {
        throw error
    }
},

//updateUser
updateuserpassword: async function updateuserpassword(data) {
    try{
        const existingUserEmail = await prisma.user.findFirst({
            where: { uuid: data.userId },
        });
        if (!existingUserEmail) {
            throw ('User not found');
        }
        const hashedPasswordCheck = await isValidPassword(data.oldpassword,existingUserEmail.password)
        if(!hashedPasswordCheck){
            throw ('old password is not match')
        }

        const hashedPassword = createHash(data.newpassword)

        if(!hashedPassword){
            throw ( "Error creating new user password")
        }
        const updateuserdata = await prisma.user.update({
            where:{
                uuid:data.userId
            },
            data:{
                password:hashedPassword,
                updated_At:new Date()
            }
        })
        if(updateuserdata){
            return "update password successfull"
        }
    } catch (error) {
        throw error
    }
},



//updateavatar
updateAvatar:async function updateAvatar(file,data) {
    try{
        const existingUserName = await prisma.user.findFirst({where:{uuid:data.userId}})
        if (!existingUserName) {
            throw ('Soory user not exist');
        }
        const updateprofiledata = await uploadAvatar(existingUserName,file)
        if(updateprofiledata){
            return updateprofiledata
        }
    } catch (error) {
        throw error
    }
},


//userchel
trackSubscription:async function trackSubscription(data) {
    try{
        const check = await prisma.subscription.findUnique({where:{musicId:data.musicId}})
        if(check){
            const updateBudget = await prisma.subscription.update({
                where:{
                    musicId:data.musicId
                },
                data:{
                    budgetplan:data.budgetplan,
                    budgetamount:data.budgetamount,
                    startDateTime:data.startDateTime,
                    endDateTime:data.endDateTime
                }
            })
            const update = await prisma.artistlibrary.update({
                where:{uuid:data.musicId},
                data:{subscription:true,status:"approve"}
            })
           
            if(updateBudget&&update){
                const amountValue = parseFloat(data.budgetamount);
                const create = await prisma.adminearning.create({
                    data:{
                        userId:update.userId,
                        amount:amountValue
                    }
                })
                return "Buget update  successfull!"
            }
        }else{
            throw "Music not found"
        }
    }catch(error){
        console.log("Er",error)
        throw error
    }
   
}


}