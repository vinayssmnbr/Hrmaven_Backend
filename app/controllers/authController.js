const {google}=require('../services/authservice')
const googleController=async(req,res)=>{
  try{
    const {userProfile}=req;
    const {token}=await google(userProfile)
    res.redirect(`http://localhost:4200/login?token=${token}`);
  }catch(error){
    console.log("error", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { googleController };