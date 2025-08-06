const { Router, Request, Response, NextFunction } = require('express');
const { ValidationError, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/authmiddleware');
const { ValidationArtistApprovel, ValidationManageProfile } = require('../validation/artistvalidation');
const { getArtistLibrary, getLog, getSongPlayed, getdashBoardData, getmanageprofile, manageprofile } = require('../controllers/artistcontroller');
const prisma = new PrismaClient()
const router = Router();



//manageprofile
router.post("/manageprofile", verifyToken, ValidationManageProfile, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const createLink = await manageprofile(req.body)
        if (createLink) {
            res.status(201).json({ "status": "success", "manageprofilelink": createLink })
        }
    } catch (error) {
        res.status(400).json({ message:error })
    } finally {
        await prisma.$disconnect();
    }
})

//manageprofile
router.get("/manageprofile", verifyToken,  async (req, res) => {
    try {
        const getdata = await getmanageprofile(req.body)
        if (getdata) {
            res.status(201).json({ "status": "success", "manageprofile": getdata })
        }
    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//artistlibrary
router.get("/artistlibrary", verifyToken,  async (req, res) => {
    try {
        const getdata = await getArtistLibrary(req.body)
        if (getdata) {
            res.status(201).json({ "status": "success", "artistlibrary": getdata })
        }
    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


//impressions
router.get("/dashboard", verifyToken,  async (req, res) => {
    try {
        const getdata = await getdashBoardData(req.body)
        res.status(201).json({ "status": "success", "dashboard": getdata })
    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


//soundplayed
router.get("/songplayed", verifyToken,  async (req, res) => {
    try {
        const getdata = await getSongPlayed(req.body)
        res.status(201).json({ "status": "success", "songplayed": getdata })
    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//soundplayed
router.get("/log", verifyToken,  async (req, res) => {
    try {
        const getdata = await getLog(req.body)
        res.status(201).json({ "status": "success", "log": getdata })
    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})





module.exports = router;