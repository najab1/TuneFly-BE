const { PrismaClient } = require('@prisma/client');
const e = require('express');
const moment = require('moment');
const { formatDate, formatMonth, formatYear, groupBy, formatWeek } = require('../utils/LogFunction');
const uuidv4 = require('uuid').v4;


const prisma = new PrismaClient()

module.exports = {
    //current paly track 
    currentPlayTrack: async function currentPlayTrack(data) {
        try {
            const check = await prisma.currentsong.findUnique({ where: { userId: data.userId } })
            if (check) {
                const update = await prisma.currentsong.update({
                    where: {
                        userId: data.userId
                    },
                    data: {
                        userId: data.userId,
                        musicId: data.musicId
                    }
                })
                if (update) {
                    return "update current track"
                }
            } else {
                const update = await prisma.currentsong.create({
                    data: {
                        userId: data.userId,
                        musicId: data.musicId
                    }
                })
                if (update) {
                    return "set current track"
                }
            }


        } catch (error) {
            throw error
        }
    },

    //get current paly track 
    getcurrentPlayTrack: async function getcurrentPlayTrack(data) {
        try {
            const currentTrack = await prisma.currentsong.findUnique({
                where: { userId: data.userId },
            })
            if (currentTrack) {
                const artistLibrary = await prisma.artistlibrary.findUnique({
                    where: {
                        uuid: currentTrack?.musicId
                    }
                });
                const artistauthor = await prisma.userartistprofile.findFirst({
                    where: { userId: artistLibrary?.userId }
                })
                const favourite = await prisma.likedtrack.findFirst({
                    where: { userId: data?.userId, musicId: artistLibrary?.uuid }
                })
                return {
                    ...currentTrack,
                    artistLibrary,
                    artistauthor,
                    like: favourite ? true : false
                }
            } else {
                return { data: "null" }
            }
        } catch (error) {
            throw error
        }
    },

    //like track 
    likeTrack: async function likeTrack(data) {
        const uuid = uuidv4()
        try {
            const check = await prisma.artistlibrary.findFirst({
                where: { uuid: data.musicId }
            })
            if (!check) {
                throw ('Sorry music track not found');
            }
            const checklike = await prisma.likedtrack.findFirst({
                where: { userId: data.userId, musicId: data.musicId }
            })
            if (checklike) {
                const deletedata = await prisma.likedtrack.delete({
                    where: { uuid: checklike.uuid },
                })
                if (deletedata) {
                    return ("Unlike successfully")
                }
            } else {
                const createdata = await prisma.likedtrack.create({
                    data: {
                        uuid: uuid,
                        userId: data.userId,
                        musicId: data.musicId,
                    }
                })
                if (createdata) {
                    return ("Like successfully")
                }
            }

        } catch (error) {
            throw error
        }
    },


    //getHistoryTrack track 
    getlikeTrack: async function getlikeTrack(data, musicId) {
        try {
            const likeTrack = await prisma.likedtrack.findFirst({
                where: { userId: data.userId, musicId: musicId },
            })
            if (likeTrack == null) {
                return { like: false }
            } else {
                return { like: true }
            }

        } catch (error) {
            throw error
        }
    },

    //like track 
    getTrack: async function getTrack(data) {
        try {
            const likedTracksWithArtistLibrary = [];
            const likedTrack = await prisma.likedtrack.findMany({
                where: { userId: data.userId },

            })
            if (likedTrack.length == 0) {
                return [];
            }
            for (const likedTracks of likedTrack) {
                const artistLibrary = await prisma.artistlibrary.findUnique({
                    where: {
                        uuid: likedTracks.musicId
                    }
                });
                const artistauthor = await prisma.userartistprofile.findFirst({
                    where: { userId: artistLibrary?.userId }
                })

                const likedTrackWithArtistLibrary = {
                    artistLibrary,
                    artistauthor,
                    ...likedTracks,
                };

                likedTracksWithArtistLibrary.push(likedTrackWithArtistLibrary);
            }
            return likedTracksWithArtistLibrary

        } catch (error) {
            throw error
        }
    },


    //hostory add track 
    historyTrack: async function historyTrack(data) {
        const uuid = uuidv4()
        try {

            const check = await prisma.artistlibrary.findFirst({
                where: { uuid: data.musicId }
            })
            if (!check) {
                throw ('Sorry music track not found');
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to compare only the date

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const checkHistory = await prisma.historytrack.findFirst({
                where: {
                    userId: data.userId, musicId: data.musicId,
                    created_At: {
                        gte: today,  // Greater than or equal to today's date
                        lt: tomorrow, // Less than tomorrow's date (i.e., before midnight)
                    },
                }
            })
            if (checkHistory) {
                const updateHistory = await prisma.historytrack.update({
                    where: {
                        uuid: checkHistory.uuid
                    },
                    data: {
                        userId: data.userId,
                        musicId: data.musicId
                    }
                })
                return "history update successfully"
            } else {

                const createdata = await prisma.historytrack.create({
                    data: {
                        uuid: uuid,
                        userId: data.userId,
                        musicId: data.musicId
                    }
                })
                return "history create successfully"
            }


        } catch (error) {
            console.log("us", error)
            throw error
        }
    },


    //getHistoryTrack track 
    getHistoryTrack: async function getHistoryTrack(data) {
        try {
            const historyTracksWithArtistLibrary = [];
            const historyTrack = await prisma.historytrack.findMany({
                where: { userId: data.userId },

            })
            if (!historyTrack) {
                return ([]);
            }
            for (const historyTracks of historyTrack) {
                const artistLibrary = await prisma.artistlibrary.findUnique({
                    where: {
                        uuid: historyTracks.musicId
                    }
                });
                const artistauthor = await prisma.userartistprofile.findFirst({
                    where: { userId: artistLibrary?.userId }
                })
                const historyTrackWithArtistLibrary = {
                    artistLibrary,
                    artistauthor,
                    ...historyTracks,
                };

                historyTracksWithArtistLibrary.push(historyTrackWithArtistLibrary);
            }
            return historyTracksWithArtistLibrary

        } catch (error) {
            throw error
        }
    },


    //impressions artist 
    createImpressions: async function createImpressions(data) {
        const uuid = uuidv4()
        try {
            const check = await prisma.impressions.findFirst({
                where: { userId: data.userId, artistId: data.artistId, musicId: data.musicId }
            })
            if (check) {
                return "Already Done!"
            }
            const createdata = await prisma.impressions.create({
                data: {
                    uuid: uuid,
                    userId: data.userId,
                    artistId: data.artistId,
                    musicId: data.musicId,
                    country: data.country
                }
            })
            if (createdata) {
                return (createdata)
            }

        } catch (error) {
            throw error
        }
    },

    //createListener artist 
    createListener: async function createListener(data) {
        const uuid = uuidv4()
        try {
            const check = await prisma.listener.findFirst({
                where: { userId: data.userId, artistId: data.artistId, musicId: data.musicId }
            })
            if (check) {
                return "Already Done!"
            }
            const createdata = await prisma.listener.create({
                data: {
                    uuid: uuid,
                    userId: data.userId,
                    artistId: data.artistId,
                    musicId: data.musicId,
                    country: data.country
                }
            })
            if (createdata) {
                return (createdata)
            }

        } catch (error) {
            throw error
        }
    },
    //createSongPlayed artist 
    createSongPlayed: async function createSongPlayed(data) {
        const uuid = uuidv4()
        try {
            const check = await prisma.songplayed.findFirst({
                where: { userId: data.userId, artistId: data.artistId, musicId: data.musicId }
            })
            if (check) {
                return "Already Done!"
            }
            const createdata = await prisma.songplayed.create({
                data: {
                    uuid: uuid,
                    userId: data.userId,
                    artistId: data.artistId,
                    musicId: data.musicId,
                    country: data.country
                }
            })
            if (createdata) {
                return (createdata)
            }

        } catch (error) {
            throw error
        }
    },


    //getArtistLibrary artist 
    getAllArtistLibrary: async function getAllArtistLibrary(data) {
        try {
            const AllUsers = [];
            const getdata = await prisma.artistlibrary.findMany({
                where: {
                    status: "approve"
                }
            })
            if (getdata.length == 0) {
                return []
            }
            for (const user of getdata) {
                const artistauthor = await prisma.userartistprofile.findUnique({
                    where: { userId: user?.userId }
                })

                const likedTrackWithArtistLibrary = {
                    artistauthor,
                    artistLibrary: user,
                };
                const getcompaign = await prisma.compaign.findUnique({ where: { musicId: user?.uuid } })
                const getsubcription = await prisma.subscription.findUnique({ where: { musicId: user?.uuid } })
                if (getcompaign && getsubcription) {
                    if (Number(getcompaign.amount.toFixed(1)) < Number(Number(getsubcription.budgetamount).toFixed(1))) {
                        AllUsers.push(likedTrackWithArtistLibrary);
                    } else {
                        await prisma.compaign.update({
                            where: { musicId: getcompaign?.musicId },
                            data: { amount: 0.0 }
                        })
                        await prisma.artistlibrary.update({
                            where: { uuid: getcompaign?.musicId },
                            data: { status: "renew", subscription: false }
                        })
                    }
                }

            }
            return AllUsers
        } catch (error) {
            throw error
        }
    },


    //create eraning 
    createEarning: async function createEarning(data) {
        try {
            const getBalance = await prisma.availablebalance.findUnique({ where: { userId: data.userId } })
            const getmusic = await prisma.compaign.findUnique({ where: { musicId: data.musicId } })
            const listrates = await prisma.rates.findFirst({where:{id:1}})
            let amount = 0
            if (listrates.hasOwnProperty(data.play)) {
                amount = listrates[data.play]
            }
            if (getmusic) {
                const newamount = Number(getmusic?.amount) + Number(amount)
                await prisma.compaign.update({
                    where: {
                        musicId: data.musicId,
                    },
                    data: {
                        amount: newamount
                    }
                })
            }
            if (getBalance) {
                const newamount = Number(getBalance?.amount) + Number(amount)
                await prisma.availablebalance.update({
                    where: {
                        userId: data.userId,
                    },
                    data: {
                        amount: newamount
                    }
                })
            } else {
                await prisma.availablebalance.create({
                    data: {
                        userId: data.userId,
                        amount: Number(amount)
                    }
                })
            }
            const create = await prisma.earning.create({
                data: {
                    userId: data.userId,
                    amount: Number(amount)
                }
            })
            return create
        } catch (error) {
            throw error
        }
    },

    //get Earning 
    getEarning: async function getEarning(data) {
        try {
            const earningList = await prisma.earning.findMany({
                where: { userId: data.userId },
            })
            const totalEarning = earningList?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3);
            const dailyEarnings = earningList.reduce((acc, entry) => {
                const date = formatDate(entry.created_At);
                if (!acc[date]) {
                  acc[date] = 0;
                }
                acc[date] += entry.amount;
                return acc;
              }, {});
              
              const logsForChartDaily = Object.entries(dailyEarnings).map(([date, amount]) => ({
                date,
                amount
              }));

              //yearly
            const yearlyEarnings = earningList.reduce((acc, entry) => {
                const year = formatYear(entry.created_At);
                if (!acc[year]) {
                  acc[year] = 0;
                }
                acc[year] += entry.amount;
                return acc;
              }, {});
              const logsForChartyYearly = Object.entries(yearlyEarnings).map(([year, amount]) => ({
                year,
                amount
              }));

            const today = earningList?.filter(item => {
                return moment(item.created_At).date() === moment().date();
            })
            const todayEarning = today?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
            var paymentLogs = [];
            if (earningList.length > 0) {
                const priceozerotofive = earningList.filter(item => {
                    return moment(item.created_At).date() >= 1 && moment(item.created_At).date() <= 5
                })
                const pricefivetoten = earningList.filter(item => {
                    return moment(item.created_At).date() >= 5 && moment(item.created_At).date() <= 10
                })
                const pricetentofiften = earningList.filter(item => {
                    return moment(item.created_At).date() >= 10 && moment(item.created_At).date() <= 15
                })
                const pricefiftentotwenty = earningList.filter(item => {
                    return moment(item.created_At).date() >= 15 && moment(item.created_At).date() <= 20
                })
                const pricetwentytotwentyfive = earningList.filter(item => {
                    return moment(item.created_At).date() >= 20 && moment(item.created_At).date() <= 25
                })
                const pricetwentyfivetothirty = earningList.filter(item => {
                    return moment(item.created_At).date() >= 25 && moment(item.created_At).date() <= 31
                })
                const firstamount = priceozerotofive?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
                const secondamount = pricefivetoten?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
                const thirdamount = pricetentofiften?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
                const fourthamount = pricefiftentotwenty?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
                const fiveamount = pricetwentytotwentyfive?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
                const sixamount = pricetwentyfivetothirty?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(3)
                paymentLogs.push(
                    0, Number(firstamount),
                    Number(secondamount), Number(thirdamount),
                    Number(fourthamount), Number(fiveamount),
                    Number(sixamount)
                )

            }

            const getSongPlayed = await prisma.songplayed.findMany({where:{userId:data.userId}})
            const dailyPlays = Object.values(groupBy(getSongPlayed, formatDate));
            const monthlyPlays = Object.values(groupBy(getSongPlayed, formatMonth)).reduce((acc, curr) => acc + curr, 0).toFixed(0);
            const yearlyPlays = Object.keys(groupBy(getSongPlayed, formatYear)).length;
            const weeklyPlays = Object.keys(groupBy(getSongPlayed, formatWeek)).length;
            
            return {
                totalEarning: Number(totalEarning),
                todayEarning: Number(todayEarning),
                paymentLogs,
                logsForChartDaily,
                logsForChartyYearly,
                songplayedlog:{
                    daily:dailyPlays[0],
                    monthly:monthlyPlays,
                    yearly:yearlyPlays,
                    weekly:weeklyPlays,
                }
            }
        } catch (error) {
            throw error
        }
    },


    //GetAvailableBalance 
    getAvailableBalance: async function getAvailableBalance(data) {
        try {
            const getBalance = await prisma.availablebalance.findUnique({ where: { userId: data.userId } })
            if (getBalance != null) {
                return { getBalance: getBalance }
            } else {
                return { getBalance: null }
            }
        } catch (error) {
            throw error
        }
    }

}