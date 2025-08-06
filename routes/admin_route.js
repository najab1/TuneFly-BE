const { Router, Request, Response, NextFunction } = require('express');
const { ValidationError, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/authmiddleware');
const { getArtistUser, getDriveUsers, getLogs, getArtistLibrary, updateStatusArtistLibrary, getArtistLibraryApprovell, updateStatusArtist, getUser, updateRates, getRates, getUserFromId, createQRCodeID, getQRCode } = require('../controllers/admincontroller');
const { ValidationChangeStatus, ValidationStatusArtist } = require('../validation/adminvalidation');

const prisma = new PrismaClient()
const router = Router();


router.get("/alldriver", verifyToken,  async (req, res) => {
    try {
        const getdriver = await getDriveUsers()
        res.status(201).json({ "status": "success", "alldrivers": getdriver })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.get("/allartist", verifyToken,  async (req, res) => {
    try {
        const getartist = await getArtistUser()
        res.status(201).json({ "status": "success", "allartists": getartist })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.get("/withdraw", verifyToken,  async (req, res) => {
    try {
        
        res.status(201).json({ "status": "success", "withdraw": [] })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.post("/changestatus", verifyToken,ValidationChangeStatus,  async (req, res) => {
    try {
        const updateArtistStatus = await updateStatusArtist(req.body)

        res.status(201).json({ "status": "success", "update": updateArtistStatus })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.post("/approveartist", verifyToken,ValidationStatusArtist,  async (req, res) => {
    try {
        
        const updateArtistStatus = await updateStatusArtistLibrary(req.body)

        res.status(201).json({ "status": "success", "update": updateArtistStatus })

    } catch (error) {
        
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.get("/artistlibrary", verifyToken,  async (req, res) => {
    try {
        const getartist = await getArtistLibrary()

        res.status(201).json({ "status": "success", "artistlibrary": getartist })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.get("/artistlibraryApprovell", verifyToken,  async (req, res) => {
    try {
        const getartist = await getArtistLibraryApprovell()

        res.status(201).json({ "status": "success", "artistlibraryapprove": getartist })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.get("/logs", verifyToken,  async (req, res) => {
    try {
        const getlogs = await getLogs()
        res.status(201).json({ "status": "success", "logs": getlogs })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


router.get("/user", verifyToken,  async (req, res) => {
    try {
        const getuser = await getUser(req.body)
        res.status(201).json({ "status": "success", "user": getuser })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


router.post("/rates", verifyToken,  async (req, res) => {
    try {
        const get = await updateRates(req.body)
        res.status(201).json({ "status": "success", "updateRates": get })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


router.get("/rates", verifyToken,  async (req, res) => {
    try {
        const get = await getRates(req.body)
        res.status(201).json({ "status": "success", "getRate": get })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


router.get("/user/:id",  async (req, res) => {
    try {
        const get = await getUserFromId(req.params.id)
        res.status(201).json({ "status": "success", "getUser": get })

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

router.post("/qrcode",verifyToken,  async (req, res) => {
    try {
        const getQR = await createQRCodeID(req.body)
        res.status(201).json({ "status": "success",  "createQRLength": getQR.length, "createQR": getQR,})

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})



router.get("/qrcode",verifyToken,  async (req, res) => {
    try {
        const getQR = await getQRCode()
        res.status(201).json({ "status": "success",  "getQRLength": getQR.length, "getQR": getQR,})

    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


module.exports = router