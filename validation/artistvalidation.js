const { body, query } = require('express-validator');

 const ValidationArtistApprovel = [
    body('artistname').notEmpty().withMessage('Artist Name is required').bail().isLength({min:4}).withMessage("Artistname must be atleast 4 character long"),
    body('genre').notEmpty().withMessage('genre is required'),
    body('country').notEmpty().withMessage('country is required'),
    body('media').notEmpty().withMessage('media is required'),
    body("own")
    .custom(value => {
      if (value !== true && value == false) {
        throw new Error ('Please accept these own rights');
      }
      return true; 
    }),
    body("userId").notEmpty().withMessage('userId is required')
];

 const ValidationManageProfile = [
    body('link').notEmpty().withMessage('link is required'),
];

 const ValidationImpression = [
    body('artistId').notEmpty().withMessage('artistId is required'),
    body('country').notEmpty().withMessage('country is required'),
    body('musicId').notEmpty().withMessage('musicId is required'),
];


module.exports = { 
  ValidationArtistApprovel,
  ValidationManageProfile,
  ValidationImpression,
};