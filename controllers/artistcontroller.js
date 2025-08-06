const { PrismaClient } = require('@prisma/client');
const uuidv4 = require('uuid').v4;
const { checkSocialMedia } = require('../utils/linkCheck');
const { updateManageProfile } = require('../middleware/artistmiddleware');
const moment = require('moment');

const prisma = new PrismaClient()

module.exports ={
//manageprofile artist 
manageprofile:async function manageprofile(data){
    try {
        const check = checkSocialMedia(data.link)
        if(!check){
            throw "sorry only mention links are allow"
        }
        const updatedata = updateManageProfile(data,check)
        if(updatedata){
            return(updatedata)
        }

    } catch (error) {
        throw error
    }
},
//getmanageprofile artist 
getmanageprofile:async function getmanageprofile(data) {
    try {
        const getdata = await prisma.manageartistprofile.findMany({
            where:{userId:data.userId}
        })
        return getdata
    } catch (error) {
        throw error
    }
},

//getArtistLibrary artist 
getArtistLibrary:async function getArtistLibrary(data) {
    try {
        const getdata = await prisma.artistlibrary.findMany({
            where:{userId:data.userId}
        })
        return getdata
    } catch (error) {
        throw error
    }
},

//getImpressions artist 
getdashBoardData:async function getdashBoardData(data) {
    try {
        const getdata = await prisma.impressions.count({
            where:{artistId:data.userId},
        })
        const getdatalistener = await prisma.listener.findMany({
            where:{artistId:data.userId},
        })
        const getdataartistlibrary = await prisma.artistlibrary.count({
            where:{userId:data.userId},
        })
        let monthlistener;
        if(getdatalistener.length>0){
            monthlistener = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month();
            }).length
            
        }else{
            monthlistener = 0
        }

        return {"impressions":getdata,"listener":getdatalistener?.length,"totalArtistLibrary":getdataartistlibrary,"monthlistener":monthlistener}
    } catch (error) {
        throw error
    }
},



//getListener artist 
getSongPlayed:async function getSongPlayed(data) {
    try {
        const getdata = await prisma.songplayed.count({
            where:{artistId:data.userId},
        })
        const getdatalistener = await prisma.listener.findMany({
            where:{artistId:data.userId},
        })
        let monthlistener;
        if(getdatalistener.length>0){
            monthlistener = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month();
            }).length
            
        }else{
            monthlistener = 0
        }

        return {"songplayed":getdata,"listener":getdatalistener?.length,"scanned":0,"monthlistener":monthlistener}
    } catch (error) {
        throw error
    }
},


//log artist 
getLog:async function getLog(data) {
    try {
        const getdata = await prisma.songplayed.findMany({
            where:{artistId:data.userId},
        })
        const getdatalistener = await prisma.listener.findMany({
            where:{artistId:data.userId},
        })
        let listenerlist = [];
        let songplayedlist = [];
        if(getdata.length>0){
            const US = getdata.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "USA"
            }).length
            const Canada = getdata.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "Canada"
            }).length
            const UK = getdata.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "UK"
            }).length
            const China = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "China"
            }).length
            songplayedlist.push(0,US,Canada,UK,China)
            
        }
        if(getdatalistener.length>0){
            const US = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "USA"
            }).length
            const Canada = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "Canada"
            }).length
            const UK = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "UK"
            }).length
            const China = getdatalistener.filter(item => {
                return moment(item.created_At).month() === moment().month() && item.country == "China"
            }).length
            listenerlist.push(0,US,Canada,UK,China)
            
        }

        return {"listenerlist":listenerlist,"songplayedlist":songplayedlist}
    } catch (error) {
        throw error
    }
}

}

