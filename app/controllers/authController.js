const { google } = require("../services/authservice");
const googleController = async (req, res) => {
  try {
    const { userProfile } = req;
    const fetch = await google(userProfile);
    const token = fetch.token;
    const email = fetch.user.email;
    const hrid = await fetch.user._id;
    console.log(fetch);
    // res.redirect(`https://turneazy.com/login?token=${token}`);
    res.redirect(`https://turneazy.com/login?token=${token}&email=${email}&hrid=${hrid}`);
  } catch (error) {
    res.redirect('https://turneazy.com/login?token=notfound');
  }
};

module.exports = { googleController };
