const { PrismaClient } = require('@prisma/client');
const e = require('express');
const { getdashBoardData } = require('./artistcontroller');
const prisma = new PrismaClient()
const uuidv4 = require('uuid').v4;


module.exports = {

    getDriveUsers: async function getDriveUsers(data) {
        try {
            var List = []
            const check = await prisma.user.findMany({
                where: {
                    usertype: "driver"
                },
                include: {
                    UserDriverProfile: true,

                }
            })
            const filterArray = check.filter((item)=>item.email!=item.uuid)
            for (const user of filterArray) {
                const license = await prisma.driveruserlicense.findUnique({
                    where: {
                        userId: user.uuid
                    }
                })
                const getUserQR = await prisma.qrcode.findMany()
                const qrcode = await getUserQR.find((item)=>item.userId === user.uuid)
                const DriverData = {
                    ...user,
                    license,
                    qrcode
                };
                List.push(DriverData)
            }

            return List

        } catch (error) {
            throw error
        }
    },
    getArtistUser: async function getArtistUser(data) {
        try {
            var List = []
            const check = await prisma.user.findMany({
                where: {
                    usertype: "artist"
                },
                include: {
                    UserArtistProfile: true,
                }
            })
            const filterArray = check.filter((item)=>item.email!=item.uuid)
            for (const user of filterArray) {
                const data = {
                    userId: user.uuid
                }
                const logs = await getdashBoardData(data)

                const ArtistData = {
                    ...user,
                    logs
                };
                List.push(ArtistData)
            }

            return List

        } catch (error) {
            throw error
        }
    },
    getLogs: async function getLogs(data) {
        try {
            const totaldriver = await prisma.user.findMany({
                where: {
                    usertype: "driver"
                }
            })
            const totalartist = await prisma.user.findMany({
                where: {
                    usertype: "artist"
                }
            })
            const filterArrayDriver = await totaldriver.filter((item)=>item.email!=item.uuid)
            const filterArrayArtist = await totalartist.filter((item)=>item.email!=item.uuid)
            const totalsong = await prisma.artistlibrary.count()
            const Earning = await prisma.adminearning.findMany()
            const totalEarning = Earning.reduce((acc, curr) => acc + Number(curr.amount), 0)

            return {
                totaldriver:filterArrayDriver.length,
                totalartist:filterArrayArtist.length,
                totalsong,
                totalEarning,
            }
        } catch (error) {
            throw error
        }
    },

    getArtistLibrary: async function getArtistLibrary(data) {
        try {
            const check = await prisma.artistlibrary.findMany()
            const filterData = check.filter(item => item.status != "approve")
            return filterData
        } catch (error) {
            throw error
        }
    },
    getArtistLibraryApprovell: async function getArtistLibraryApprovell(data) {
        try {
            const AllUsers = [];
            const check = await prisma.artistlibraryApprovel.findMany()
            for (const user of check) {
                const artistauthor = await prisma.userartistprofile.findUnique({
                    where: { userId: user.userId, approvel: false }
                })
                if (artistauthor) {
                    const ArtistLibrary = {
                        artistauthor,
                        ...user,
                    };
                    AllUsers.push(ArtistLibrary)
                }
            }
            return AllUsers
        } catch (error) {
            throw error
        }
    },

    updateStatusArtistLibrary: async function updateStatusArtistLibrary(data) {
        try {
            const check = await prisma.artistlibrary.findUnique({
                where: {
                    uuid: data.recordId
                }
            })
            const checkNotification = await prisma.notification.findUnique({
                where: {
                    musicId: data.recordId
                }
            })
            if (!check) {
                throw "Sorry track not found"
            }
            const update = await prisma.artistlibrary.update({
                where: {
                    uuid: data.recordId,
                },
                data: {
                    status: data.status
                }
            })

            if (checkNotification) {
                const updateNoti = await prisma.notification.update({
                    where: {
                        musicId: data.recordId,
                    },
                    data: {
                        status: data.status
                    }
                })
                return update
            } else {
                const uuid = uuidv4()
                const creatNotification = await prisma.notification.create({
                    data: {
                        uuid: uuid,
                        fromId: data.userId,
                        toId: check.userId,
                        status: data.status,
                        message: "",
                        musicId: data.recordId
                    }
                })
                return update
            }




        } catch (error) {
            console.log("er", error)
            throw error
        }
    },


    updateStatusArtist: async function updateStatusArtist(data) {
        try {
            const update = await prisma.userartistprofile.update({
                where: {
                    userId: data.toId,
                },
                data: {
                    approvel: data.status
                }
            })
            return update
        } catch (error) {
            throw error
        }
    },


    getUser: async function getUser(data) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    uuid: data.userId,
                },
            })
            return user
        } catch (error) {
            throw error
        }

    },


    updateRates: async function updateRates(data) {
        try {
            const update = await prisma.rates.update({
                where: {
                    id: 1,
                },
                data: {
                    quatar: data.quatar,
                    half: data.half,
                    third: data.third,
                    complete: data.complete
                }
            })
            return update
        } catch (error) {
            throw error
        }

    },

    getRates: async function getRates(data) {
        try {
            const get = await prisma.rates.findMany({
                where: {
                    id: 1,
                },
            })
            return get
        } catch (error) {
            throw error
        }

    },


    getUserFromId: async function getUserFromId(qrId) {
        try {
            const getUser = await prisma.qrcode.findUnique({
                where:{qrId:qrId}
            })
            const userId = getUser.userId
            const driveruser = await prisma.user.findUnique({
                where: {
                    uuid: userId,
                },
                include: {
                    "UserDriverProfile": true
                }
            })
            const currentsong = await prisma.currentsong.findUnique({
                where: {
                    userId: userId
                }
            })
            let getallTracks;
            let artistuser;
            let logs;
            if (currentsong) {
                const gettracks = await prisma.artistlibrary.findUnique({
                    where: { uuid: currentsong.musicId }
                })
                if (gettracks) {
                    artistuser = await prisma.user.findUnique({
                        where: { uuid: gettracks.userId },
                        include: {
                            "UserArtistProfile": {
                                "include": {
                                    "manageartistprofile": true
                                }
                            },

                        }
                    })
                    getallTracks = await prisma.artistlibrary.findMany({
                        where: {
                            userId: gettracks.userId
                        }
                    })
                    logs = await getdashBoardData({ userId: gettracks.userId })
                }
            }
            return {
                driver: driveruser,
                drivercurrentsong: currentsong,
                alltracks: getallTracks,
                artistuser: artistuser,
                logs: logs
            }
        } catch (error) {
            throw error
        }

    },



    createQRCodeID: async function createQRCodeID(data) {
        const checkUUIDExists = async (uuid) => {
            const record = await prisma.qrcode.findUnique({
                where: { qrId: uuid }
            });
            return record !== null;
        };

        try {
            const uuids = new Set();
            let list = []
            while (uuids.size < Number(data.number)) {
                const uuid = uuidv4();
                const exists = await checkUUIDExists(uuid);
                if (!exists) {
                    uuids.add(uuid);
                    const createId = await prisma.qrcode.create({
                        data: {
                            qrId: uuid,
                        }
                    });
                    list.push(createId)
                }
            }

            return list;
        } catch (error) {
            console.log("er", error)
            throw error
        }

    },

    getQRCode: async function getQRCode(data) {
        try {
            const get = await prisma.qrcode.findMany({
                where: {
                    userId: "null",
                },
            })
            return get
        } catch (error) {
            throw error
        }

    },

} 