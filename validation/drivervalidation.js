const { body, query } = require('express-validator');

 const ValidationLikeTrack = [
    body('musicId').notEmpty().withMessage('musicId is required'),
];
 const ValidationLikeTrackGet = [
    query('musicId').notEmpty().withMessage('musicId is required'),
];


 const ValidationCreateEarning = [
    body('play').notEmpty().withMessage('play is required'),
    body('musicId').notEmpty().withMessage('musicId is required'),

];

module.exports={
    ValidationLikeTrack,
    ValidationLikeTrackGet,
    ValidationCreateEarning
}