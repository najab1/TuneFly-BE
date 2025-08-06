const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const uuidv4 = require('uuid').v4;


module.exports={
    
createNotification:async function createNotification(data) {
    const uuid = uuidv4();
    try {
        const updateStatus = await prisma.artistlibrary.update({
            where:{
                uuid:data.musicId
            },
            data:{
                status:data.status
            }
        })
        const create = await prisma.notification.create({
            data:{
             uuid:uuid,
             fromId:data.fromId,
             toId:data.toId,
             message:"",
             status:data.status,
             musicId:data.musicId
            }
        })
       
        if (updateStatus && create){

            return create
        }else{
            throw "No create notification this time."
        }
    } catch (error) {
        throw error
    }
},


getNotification:async function getNotification(data) {
    try {
        const getList = await prisma.notification.findMany({
            where:{
                toId:data.userId
            },
            include:{
                artistlibrary:true
            }
            
        })
        return getList
    } catch (error) {
        throw error
    }
}
}