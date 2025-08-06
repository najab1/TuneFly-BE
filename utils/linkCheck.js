
function checkSocialMedia(link) {
    if (/^https?:\/\/(www\.)?instagram\.com\/.*/.test(link)) {
        return "instagram";
    } else if (/^https?:\/\/(www\.)?twitter\.com\/.*/.test(link)) {
        return "twitter";
    } else if (/^https?:\/\/(www\.)?tiktok\.com\/.*/.test(link)) {
        return "tiktok";
    } else if (/^https?:\/\/(open\.)?spotify\.com\/.*/.test(link)) {
        return "spotify";
    } else if (/^https?:\/\/(music\.)?apple\.com\/.*/.test(link)) {
        return "apple";
    } else if (/^https?:\/\/(www\.)?soundcloud\.com\/.*/.test(link)) {
        return "soundcloud";
    } else {
        return null;
    }
}


module.exports= {
    checkSocialMedia
}