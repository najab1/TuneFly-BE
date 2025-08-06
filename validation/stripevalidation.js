const { body, query } = require('express-validator');


const ValidationCreateAccount = [
    body('email').notEmpty().withMessage('email is required'),
];
const ValidationCreateIntent = [
    body('email').notEmpty().withMessage('email is required'),
    body('amount').notEmpty().withMessage('amount is required'),
];

const ValidationPayOut = [
    body('amount').notEmpty().withMessage('amount is required'),
    body('token').notEmpty().withMessage('token is required'),
];
const ValidationSaveCard = [
    body('userId').notEmpty().withMessage('userId is required'),
    body('cardnumber').notEmpty().withMessage('cardnumber is required'),
    body('cardexp').notEmpty().withMessage('cardexp is required'),
    body('cardToken').notEmpty().withMessage('cardToken is required'),
];

const ValidationGetSaveCard = [
    body('userId').notEmpty().withMessage('userId is required'),
];

module.exports={
    ValidationCreateAccount,
    ValidationCreateIntent,
    ValidationSaveCard,
    ValidationGetSaveCard,
    ValidationPayOut
}