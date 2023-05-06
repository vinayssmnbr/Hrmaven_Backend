const {User} = require('../models/credential');

const findemailhelper = {};

findemailhelper.getCredentialsByEmail = async function(email) {
    try {
        const user = await User.findOne({email: email});
        return user;
    } catch(error) {
        console.log('Error in retrieving user by email:', error);
        throw error;
    }
}

findemailhelper.getCredentialsByUsername = async function(username) {
    try {
      const user = await User.findOne({ username: username });
      return user;
    } catch(error) {
      console.log('Error in retrieving user by username:', error);
      throw error;
    }
  };

module.exports = findemailhelper;