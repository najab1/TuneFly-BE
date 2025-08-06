const { body, query } = require('express-validator');

 const ValidationGetNotification = [
    body('userId').notEmpty().withMessage('userId is required'),
];
 const ValidationCreateNotification = [
    body('fromId').notEmpty().withMessage('fromId is required'),
    body('toId').notEmpty().withMessage('toId is required'),
    body('status').notEmpty().withMessage('status is required'),
    body('musicId').notEmpty().withMessage('musicId is required'),
];
 

module.exports={
    ValidationGetNotification,
    ValidationCreateNotification
}