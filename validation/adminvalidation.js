const { body, query } = require('express-validator');

 const ValidationChangeStatus= [
    body('musicId').notEmpty().withMessage('musicId is required'),
    body('status').notEmpty().withMessage('status is required'),
];

const ValidationStatusArtist= [
    body('recordId').notEmpty().withMessage('recordId is required'),
];



module.exports={
    ValidationChangeStatus,
    ValidationStatusArtist,
}