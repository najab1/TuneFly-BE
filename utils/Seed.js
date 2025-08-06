const { PrismaClient } = require('@prisma/client');
const { createHash } = require('./createHashPassword');
const prisma = new PrismaClient()
const uuidv4 = require('uuid').v4;
async function SeedAdmin(params) {
    try{
        const check = await prisma.user.findUnique({
            where:{
                email:"tuneflyadmin@gmail.com"
            }
        })
        if(check){
            throw "Admin user alreday insert"
        }
        const hashPassword = await createHash("123456")
        const uuid = uuidv4()
        const create = await prisma.user.create({
            data:{
                uuid:uuid,
                usertype:"admin",
                email:"tuneflyadmin@gmail.com",
                password:hashPassword,
                role:"admin",
                verify_email:true,
            }
        })
        const createrate  = await prisma.rates.create({
            data:{
                quatar:"0.025",
                half:"0.050",
                third:"0.075",
                complete:"0.1"
            }
        })
        return create
    }catch(error){
        console.log("Seed Error",error)
    }
}

module.exports={
    SeedAdmin,
}

