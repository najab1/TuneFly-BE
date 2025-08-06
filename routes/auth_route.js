const { Router, Request, Response, NextFunction } = require('express');
const { ValidationError, validationResult, body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { ValidationForgetPassword, ValidationLogin, ValidationNewPassword, ValidationSignup, ValidationVerify, ValidationResendOtp } = require('../validation/authvalidation');
const { VerifyEmail, forgetpassword, login, logout, otpSend, setpassword, signup, deleteAccount } = require('../controllers/authcontroller');
const { verifyToken } = require('../middleware/authmiddleware');
const prisma = new PrismaClient()
const router = Router();

//signup
router.post('/signup', ValidationSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try {
    const user = await signup(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    console.log("er",error)
    res.status(400).json({ message:error });
  } finally {
    await prisma.$disconnect();
  }

});
//verifyemail
router.post('/verifyemail', ValidationVerify, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try {
    const user = await VerifyEmail(req.body,req.body.otp)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});
//login
router.post('/login', ValidationLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try {
    const user = await login(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});

//forgetpassword
router.post('/resendotp', ValidationResendOtp, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try {
    const user = await otpSend(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": "send Otp successfull" })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});

//forgetpassword
router.post('/forgetpassword', ValidationForgetPassword, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try {
    const user = await forgetpassword(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});
//setnewPassword
router.post('/newpassword', ValidationNewPassword, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }

  try {
    const user = await setpassword(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});

//forgetpassword
router.post('/logout',verifyToken, async (req, res) => {
  try {
    const user = await logout(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});


//deleteaccount
router.post('/deleteaccount',verifyToken, async (req, res) => {
  try {
    const user = await deleteAccount(req.body)
    if(user){
      res.status(201).json({ "status":"success", "user": user })
    }
  }
  catch (error) {
    res.status(400).json({ message:error })
  } finally {
    await prisma.$disconnect();
  }

});




module.exports = router;