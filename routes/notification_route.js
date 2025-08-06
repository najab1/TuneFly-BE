const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/authmiddleware');
const { validationResult } = require('express-validator');
const { getNotification, createNotification } = require('../controllers/notificationcontroller');
const { ValidationGetNotification, ValidationCreateNotification } = require('../validation/notificationvalidation');


const prisma = new PrismaClient()
const router = Router();

//notification
router.post("/",ValidationCreateNotification, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const create = await createNotification(req.body)
        res.status(201).json({ "status": "success", "notification": create})

    } catch (error) {
        console.log("res",error)
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})

//get notification
router.get("/",verifyToken, ValidationGetNotification, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const getList = await getNotification(req.body)
        res.status(201).json({ "status": "success", "notificationList": getList})

    } catch (error) {
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})

module.exports = router;