const { body, query } = require('express-validator');

 const ValidationSignup = [
    body('name').optional(),
    body('email').notEmpty().withMessage('email is required').bail().isEmail().withMessage('Invalid email format'),
    body('phonenumber').optional(),
    body('username').notEmpty().withMessage('username is required').bail().isLength({min:4}).withMessage("username must be atleast 4 character long"),
    body('password').notEmpty().withMessage('password is required').bail().isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
    body('usertype').notEmpty().withMessage('usertype is required'),
    body('cartype').optional(),
    body('make').optional(),
    body('model').optional(),
    body('year').optional(),
];

 const ValidationVerify = [
    body('email').notEmpty().withMessage('email is required').bail().isEmail().withMessage('Invalid email format'),
    body('otp').notEmpty().withMessage('otp is required'),
];

 const ValidationLogin = [
    body('email').notEmpty().withMessage('email is required').bail().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('password is required'),
    body('usertype').notEmpty().withMessage('usertype is required'),
];

 const ValidationForgetPassword = [
    body('email').notEmpty().withMessage('email is required').bail().isEmail().withMessage('Invalid email format'),
    body('usertype').notEmpty().withMessage('usertype is required'),
];

 const ValidationNewPassword = [
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required'),
    body('usertype').notEmpty().withMessage('usertype is required'),
];

const ValidationResendOtp = [
    body('email').notEmpty().withMessage('email is required').bail().isEmail().withMessage('Invalid email format'),
];

module.exports={
    ValidationSignup,
    ValidationVerify,
    ValidationLogin,
    ValidationForgetPassword,
    ValidationNewPassword,
    ValidationResendOtp
}