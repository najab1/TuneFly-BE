const { Router, Request, Response, NextFunction } = require('express');
const { ValidationError, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { ValidationCreateEarning, ValidationLikeTrack, ValidationLikeTrackGet } = require('../validation/drivervalidation');
const { verifyToken } = require('../middleware/authmiddleware');
const { createEarning, createImpressions, createListener, createSongPlayed, currentPlayTrack, getAllArtistLibrary, getAvailableBalance, getEarning, getHistoryTrack, getTrack, getcurrentPlayTrack, getlikeTrack, historyTrack, likeTrack } = require('../controllers/drivercontroller');
const { ValidationImpression } = require('../validation/artistvalidation');

const prisma = new PrismaClient()
const router = Router();


//currentsong track
router.post("/currentsong", verifyToken, ValidationLikeTrack, async (req, res) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
     const firstError = errors.array({ onlyFirstError: true })[0].msg;
     return res.status(400).json({message:firstError} )
   }
     try {
         const updateTrack =  await currentPlayTrack(req.body)
         if (updateTrack) {
             res.status(201).json({ "status": "success", "currentsong": updateTrack })
         }
     } catch (error) {
              res.status(400).json({ message:error });
     } finally {
         await prisma.$disconnect();
     }
 })


 //get currentsong track
router.get("/currentsong", verifyToken, async (req, res) => {
    try {
        const getdata = await getcurrentPlayTrack(req.body)
        if (getdata) {
            res.status(201).json({ "status": "success",  ...getdata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//liketrack
router.post("/liketrack", verifyToken, ValidationLikeTrack, async (req, res) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
    try {
        const uploaddata = await likeTrack(req.body)
        if (uploaddata) {
            res.status(201).json({ "status": "success", "like": uploaddata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//getliketrack
router.get("/liketrack", verifyToken,ValidationLikeTrackGet, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
    try {
        const getdata = await getlikeTrack(req.body,req.query.musicId)
        if (getdata) {
            res.status(201).json({ "status": "success",  ...getdata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//favourite track
router.get("/favourite", verifyToken, async (req, res) => {

    try {
        const uploaddata = await getTrack(req.body)
        if (uploaddata) {
            res.status(201).json({ "status": "success", "favouritesTrack": uploaddata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//history create
router.post("/history", verifyToken,ValidationLikeTrack, async (req, res) => {
    try {
        const uploaddata = await historyTrack(req.body)
        if (uploaddata) {
            res.status(201).json({ "status": "success", "historyTrack": uploaddata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})
//history track
router.get("/history", verifyToken, async (req, res) => {

    try {
        const getdata = await getHistoryTrack(req.body)
        if (getdata) {
            res.status(201).json({ "status": "success", "history": getdata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})


//impressions
router.post("/impressions", verifyToken,ValidationImpression,  async (req, res) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
    try {
        const createData = await createImpressions(req.body)
        if (createData) {
            res.status(201).json({ "status": "success", "impressions": createData })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//listener
router.post("/listener", verifyToken,ValidationImpression,  async (req, res) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
    try {
        const createData = await createListener(req.body)
        if (createData) {
            res.status(201).json({ "status": "success", "listener": createData })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//songplayed
router.post("/songplayed", verifyToken,ValidationImpression,  async (req, res) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({message:firstError} )
  }
    try {
        const createData = await createSongPlayed(req.body)
        if (createData) {
            res.status(201).json({ "status": "success", "songplayed": createData })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

//soundplayed
router.get("/allartist", verifyToken,  async (req, res) => {
    try {
        const getdata = await getAllArtistLibrary(req.headers)
        if(getdata){
            res.status(201).json({ "status": "success", "artistlist": getdata})
        }
    } catch (error) {
        res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})




//create earning
router.post("/earning", verifyToken,ValidationCreateEarning, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0].msg;
      return res.status(400).json({message:firstError} )
    }
     try {
        const createearnig =  await createEarning(req.body)
        if (createearnig) {
            res.status(201).json({ "status": "success", "createEarning": createearnig })
        }
     } catch (error) {
            res.status(400).json({ message:error });
     } finally {
        await prisma.$disconnect();
     }
})


 //get earning
 router.get("/earning", verifyToken, async (req, res) => {
    try {
        const getdata = await getEarning(req.body)
        if (getdata) {
            res.status(201).json({ "status": "success",  "totalEarning":getdata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})

 //get balance
router.get("/balance", verifyToken, async (req, res) => {
    try {
        const getdata = await getAvailableBalance(req.body)
        if (getdata) {
            res.status(201).json({ "status": "success",  ...getdata })
        }
    } catch (error) {
             res.status(400).json({ message:error });
    } finally {
        await prisma.$disconnect();
    }
})



module.exports = router;