const { Router, Request, Response, NextFunction } = require('express');
const { ValidationError, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { ValidationArtistLibrary, ValidationDriver, ValidationDriverLicense, ValidationSubscription, ValidationUpdatePassword, ValidationUpdateProfile, ValidationArtistLibraryApprovel } = require('../validation/uservalidation');
const { uploadartistcover, uploadartistmedia, uploadavatar, uploaddriverlicense, uploaddriveruberlyft } = require('../utils/imageUpload');
const { artistdata, driverdata, trackSubscription, updateAvatar, updateprofile, updateuserpassword, userChecK, artistLibraryApprovel } = require('../controllers/usercontroller');
const { verifyToken } = require('../middleware/authmiddleware');
const { checkApprovelStatus } = require('../middleware/artistmiddleware');
const prisma = new PrismaClient()
const router = Router();




//uploadlicense image
router.post("/uploaddriver/license",ValidationDriverLicense, uploaddriverlicense.single("image"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try{
    if (!req.file) {
      throw ("Please select image")
    }
    const up = await userChecK(req.body)
    if(up){
      res.status(201).json({ "status":"success", "image": req.file.filename })
    }
  }catch(error){
    res.status(400).json({ message:error });
  }finally{
    await prisma.$disconnect();
  }


})

//uploaduberlyft image
router.post("/uploaddriver/uberlyft", ValidationDriverLicense, uploaddriveruberlyft.single("image"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try{
    if (!req.file) {
      throw ("Please select image")
    }
    const up = await userChecK(req.body)
    if(up){
      res.status(201).json({ "status":"success", "image": req.file.filename })
    }
  }catch(error){
    res.status(400).json({ message:error });
  }finally{
    await prisma.$disconnect();
  }


})

//documente
router.post("/uploaddriver/document",ValidationDriver,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try{
    const uploaddata = await driverdata(req.body)
    if(uploaddata){
      res.status(201).json({ "status":"success", "driverData": uploaddata })
    }
  }catch(error){
    res.status(400).json({ message:error });
  }finally{
    await prisma.$disconnect();
  }
})




//artistlibrarymedia image
router.post("/artistlibrary/media",ValidationDriverLicense, uploadartistmedia.single("media"), async (req, res) => {
    const errors = validationResult(req);
  
     if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => {
          return { message: error.msg };
        });
        return res.status(400).json(errorMessages );
      }
    
    try{
      if (!req.file) {
        throw ("Please select media file")
      }

      res.status(201).json({ "status":"success", "media": req?.file?.filename})
     
    }catch(error){
      console.log("er",error)
      res.status(400).json({ message:error });
    }finally{
      await prisma.$disconnect();
    }
})

//artistlibrarycover image
router.post("/artistlibrary/cover",verifyToken,ValidationDriverLicense, uploadartistcover.single("cover"), async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
  
    try{
      if (!req.file) {
        throw ("Please select image cover")
      }
      res.status(201).json({ "status":"success", "cover": req.file.filename })
    }catch(error){
      res.status(400).json({ message:error });
    }finally{
      await prisma.$disconnect();
    }
})

//artistlibrary
router.post("/artistlibrary",verifyToken,ValidationArtistLibrary,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try{
        const uploaddata = await artistdata(req.body)
        res.status(201).json({ "status":"success", "artistlibrary": uploaddata })      
    }catch(error){
      res.status(400).json({ message:error });
    }finally{
      await prisma.$disconnect();
    }
})

//artistlibrary
router.post("/approvestatus",verifyToken,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
  try{
    const checkapprove = await checkApprovelStatus(req.body)
    res.status(201).json({ "status":"success", "checkapprove": checkapprove })
    
  }catch(error){
    res.status(400).json({ message:error });
  }finally{
    await prisma.$disconnect();
  }
})
//artistlibrary
router.post("/artistlibraryapprovel",ValidationArtistLibraryApprovel,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
  try{
    const uploaddata = await artistLibraryApprovel(req.body)
    if(uploaddata){
      res.status(201).json({ "status":"success", "artistlibrary": uploaddata })
    }
  }catch(error){
    res.status(400).json({ message:error });
  }finally{
    await prisma.$disconnect();
  }
})

//subscription
router.post("/tracksubscription",verifyToken,ValidationSubscription, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
  try{
    const uploaddata = await trackSubscription(req.body)
    if(uploaddata){
      res.status(201).json({ "status":"success", "artistlibrary": uploaddata })
    }
  }catch(error){
    res.status(400).json({ message:error });
  }finally{
    await prisma.$disconnect();
  }
})

//uploadavatar user image
router.post("/upload/avatar",verifyToken,ValidationDriverLicense, uploadavatar.single("image"), async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
  
    try{
      if (!req.file) {
        throw ("Please select image")
      }
      const uploadavatardata = await updateAvatar(req.file.filename,req.body)
      res.status(201).json({ "status":"success", "uploadavatar": uploadavatardata })
    }catch(error){
      res.status(400).json({ message:error });
    }finally{
      await prisma.$disconnect();
    }
  
  
})

//updateUser
router.post("/update/user",verifyToken,ValidationUpdateProfile, async (req, res) => {
  const errors = validationResult(req);
  
   if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => {
      return { message: error.msg };
    });
    return res.status(400).json(errorMessages );
  }  
  try{
      const uploaddata = await updateprofile(req.body)
      if(uploaddata){
        res.status(201).json({ "status":"success", "updateprofile": uploaddata })
      }
    }catch(error){
      res.status(400).json({ message:error });
    }finally{
      await prisma.$disconnect();
    }
})

//updateUser
router.post("/update/password",verifyToken,ValidationUpdatePassword, async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
  try{
      const uploaddata = await updateuserpassword(req.body)
      if(uploaddata){
        res.status(201).json({ "status":"success", "user": uploaddata })
      }
    }catch(error){
      res.status(400).json({ message:error });
    }finally{
      await prisma.$disconnect();
    }
})


module.exports = router;