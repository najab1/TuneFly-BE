const  jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const secretKey = 'tuneflyclient';

async function createUserProfile(data,uuid) {
  if (data.usertype === "artist") {
    const createUserProfileData = await prisma.userartistprofile.create({
      data: {
        userId: uuid,
        name: data.name,
        username: data.username,
        phonenumber: data.phonenumber,
        country:data.country,
        manageartistprofile:{
          create:{
            instagram:null,
            twitter:null,tiktok:null,soundcloud:null,spotify:null,apple:null
          }
        }
      }
    })
    return createUserProfileData
  }
  else {
    const createUserProfileData = await prisma.userdriverprofile.create({
      data: {
        userId: uuid,
        name: data.name,
        username: data.username,
        phonenumber: data.phonenumber,
        country: data.cartype,
        make: data.make,
        model: data.model,
        year: data.year,
      }
    })
    
    return createUserProfileData
  }
}
async function updateUserProfile(data) {
  if (data.usertype === "artist") {
    const createUserProfileData = await prisma.userartistprofile.update({
      where:{
          userId:data.userId
      },
      data: {
        name: data.name,
        username: data.username,
        phonenumber: data.phonenumber,
        country:data.country,
        updated_At:new Date()
      }
    })
    return createUserProfileData
  }
  else {
    const createUserProfileData = await prisma.userdriverprofile.update({
      where:{
        userId:data.userId
      },
      data: {
        name: data.name,
        username: data.username,
        phonenumber: data.phonenumber,
        country: data.cartype,
        make: data.make,
        model: data.model,
        year: data.year,
        updated_At:new Date()
      }
    })
    return createUserProfileData
  }
}

async function checkUserName(data) {
  if (data.usertype == "artist") {
    const existingUserName = await prisma.userartistprofile.findFirst({
      where: {username:data.username},
    });
    return existingUserName
  }else{
    const existingUserName = await prisma.userdriverprofile.findFirst({
      where: { username: data.username }
    });
    return existingUserName
  }
  
}
async function uploadAvatar(data,filename) {
  if (data.usertype == "artist") {
    const existingUserName = await prisma.userartistprofile.update({
      where: {userId:data.uuid},
      data:{avatar:filename}
    });
    return existingUserName
  }else{
    const existingUserName = await prisma.userdriverprofile.update({
      where: {userId:data.uuid},
      data:{avatar:filename}
    });
    return existingUserName
  }
  
}


async function generateToken(data) {
  const expiresIn = '300d';
  const token = jwt.sign({ uuid: data.uuid, email: data.email }, secretKey, { expiresIn });

  return token;
};

async function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format. Use "Bearer <token>".' });
  }

  const tokendata = tokenParts[1];
  try {
    const decoded = await jwt.verify(tokendata, secretKey);
    if (!decoded.uuid) {
      return res.status(401).json({ error: 'Invalid token. userID not found' });
    }
    req.body.userId = decoded.uuid
    req.query.userId = decoded.uuid
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};



async function generateRandomNumber() {
  return Math.floor(Math.random() * 9000) + 1000;
}





module.exports = {
  checkUserName,
  createUserProfile,
  updateUserProfile,
  generateRandomNumber,
  generateToken,
  verifyToken,
  uploadAvatar
}

