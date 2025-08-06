const bCrypt = require ('bcrypt')

module.exports={
createHash:function createHash (password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
},

isValidPassword:function isValidPassword (password, passwordSaved){
	return bCrypt.compareSync(password, passwordSaved);
}

}