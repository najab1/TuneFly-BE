const { Router, Request, Response, NextFunction } = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/authmiddleware');
const { validationResult } = require('express-validator');
const { createIntentStripe, saveCard, getsaveCard, createPayOutStripe, createAccount } = require('../controllers/stripecontroller');
const { ValidationCreateIntent, ValidationSaveCard, ValidationGetSaveCard, ValidationPayOut, ValidationCreateAccount } = require('../validation/stripevalidation');


const prisma = new PrismaClient()
const router = Router();

//createaccount
router.post("/createaccount",ValidationCreateAccount, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        console.log("req.body",req.body)
        const createLink = await createAccount(req.body)
        res.status(201).json({ "status": "success", "url": createLink})

    } catch (error) {
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})

//createintent
router.post("/createintent", verifyToken,ValidationCreateIntent, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const createLink = await createIntentStripe(req.body)
        res.status(201).json({ "status": "success", "client_secret": createLink})

    } catch (error) {
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})


//payout
router.post("/payout", verifyToken,ValidationPayOut, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const createLink = await createPayOutStripe(req.body)
        res.status(201).json({ "status": "success", "payout": createLink})

    } catch (error) {
        console.log("er",error)
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})


//savecard
router.post("/savecard", verifyToken,ValidationSaveCard, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const createLink = await saveCard(req.body)
        res.status(201).json({ "status": "success", "save": createLink})

    } catch (error) {
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})


//getsavecard
router.get("/savecard", verifyToken,ValidationGetSaveCard, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const createLink = await getsaveCard(req.body)
        res.status(201).json({ "status": "success", "getsave": createLink})

    } catch (error) {
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})
module.exports = router;