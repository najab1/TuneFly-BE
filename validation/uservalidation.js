const { body, query } = require('express-validator');

 const ValidationDriverLicense = [
    query('userId').notEmpty().withMessage('userId is required'),
];

 const ValidationDriver = [
    body('media').notEmpty().withMessage('Uber & Lyft dashboard screenshot is required'),
    body('license').notEmpty().withMessage('license is required'),
];

 const ValidationArtistLibrary = [
    body('artistname').notEmpty().withMessage('Artist Name is required').bail().isLength({min:3}).withMessage("Artistname must be atleast 4 character long"),
    body('songname').notEmpty().withMessage('Songname is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('media').notEmpty().withMessage('Media is required'),
    body('budgetplan').notEmpty().withMessage('Budget plan is required'),
    body('budgetamount').notEmpty().withMessage('Budget amount is required'),
    body('startDateTime').notEmpty().withMessage('Start Date && Time is required'),
    body('endDateTime').notEmpty().withMessage('End Date && Time is required'),
    body("own")
    .custom(value => {
      if (value !== true && value == false) {
        throw new Error ('Please accept these own rights');
      }
      return true; 
    }),
];

const ValidationArtistLibraryApprovel = [
  body('artistname').notEmpty().withMessage('Artist Name is required').bail().isLength({min:3}).withMessage("Artistname must be atleast 4 character long"),
  body('genre').notEmpty().withMessage('genre is required'),
  body('media').notEmpty().withMessage('media is required'),
  body("own")
  .custom(value => {
    if (value !== true && value == false) {
      throw new Error ('Please accept these own rights');
    }
    return true; 
  }),
];

 const ValidationUpdateProfile= [
    body('usertype').notEmpty().withMessage('usertype is required'),
];

 const ValidationUpdatePassword= [
    body('oldpassword').notEmpty().withMessage('oldpassword is required'),
    body('newpassword').notEmpty().withMessage('newpassword is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
];


 const ValidationSubscription = [
    body('musicId').notEmpty().withMessage('musicId is required'),
    body('budgetplan').notEmpty().withMessage('budgetplan is required'),
    body('budgetamount').notEmpty().withMessage('budgetamount is required'),
    body('startDateTime').notEmpty().withMessage('startDateTime is required'),
    body('endDateTime').notEmpty().withMessage('endDateTime is required'),
];



module.exports={
    ValidationDriverLicense,
    ValidationDriver,
    ValidationArtistLibrary,
    ValidationUpdateProfile,
    ValidationUpdatePassword,
    ValidationSubscription,
    ValidationArtistLibraryApprovel
}