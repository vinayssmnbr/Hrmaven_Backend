const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/credential');


const userService = {};


userService.addUser = (req, res) => {

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        // confirm: req.body.confirm,

    });
    bcrypt.hash(user.password, 10, function(err, hashedPass) {
      if (err) {
          res.json({ error: err });
      } else {
          user.password = hashedPass;
  
          user.save()
              .then(savedUser => {
                  const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_TOKEN_KEY);
  
  
                  res.json({
                      message: 'User added successfully',
                      user: savedUser,
                      token: token,
                      _id:savedUser._id,
                      role:"hr",
                      personalDataSubmitted: user.personalDataSubmitted,
                      first:true // Add this line
                  });
              })
              .catch(error => {
                // console.log(savedUser);
                console.log("error singup:",error)
                  res.json({
                      message: 'An error occurred while saving the user',
                      error: error
                  });
              });
      }
  });
  


    // bcrypt.hash(user.password, 10, function(err, hashedPass) {
    //     if (err) {
    //         res.json({ error: err });
    //     } else {
    //         user.password = hashedPass;
    //         bcrypt.hash(user.confirm, 10, function(err, hashedConfirm) {
    //             if (err) {
    //               console.log("error singup:",err)
    //                 res.json({ error: err });
    //             } else {
    //                 user.confirm = hashedConfirm;


    //                 user.save()
    //                     .then(savedUser => {
    //                       console.log(savedUser);
    //                         const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_TOKEN_KEY);


    //                         res.json({
    //                             message: 'User added successfully',
    //                             user: savedUser,
    //                             token: token,
    //                             _id:savedUser._id,
    //                             role:"hr"
    //                         });
    //                     })
    //                     .catch(error => {
    //                       // console.log(savedUser);
    //                       console.log("error singup:",error)
    //                         res.json({
    //                             message: 'An error occurred while saving the user',
    //                             error: error
    //                         });
    //                     });
    //             }
    //         });
    //     }
    // });

};

userService.putcompanydata = async(req, res)=>{
  const { email } = req.params;
  const { name, phone, domain, headOffice, description,url } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          'personaldata.name': name,
          'personaldata.phone': phone,
          'personaldata.domain': domain,
          'personaldata.headOffice': headOffice,
          'personaldata.description': description,
          'personaldata.url':url,
          'personalDataSubmitted': true,
        }
      },
      { new: true }
    ).populate('personaldata');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while adding the user' });
  }
}


userService.updateCompany = async (req, res) => {
  const { email } = req.params;
  const update = {};
  
  const fieldsToUpdate = [ 'phone', 'headOffice', 'description', 'url'];
  
  for (const field of fieldsToUpdate) {
    if (req.body[field]) {
      update[`personaldata.${field}`] = req.body[field];
    }
  }
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: update },
      { new: true }
    ).populate('personaldata');
  
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while updating the user' });
  }
}
module.exports = userService;





















// userService.updateCompany
// const { email } = req.params;
// const update = {};

// // check which fields are present in the request body and add them to the update object
// if (req.body.name) {
//   update['personaldata.name'] = req.body.name;
// }
// if (req.body.phone) {
//   update['personaldata.phone'] = req.body.phone;
// }
// if (req.body.noOfEmployee) {
//   update['personaldata.noOfEmployee'] = req.body.noOfEmployee;
// }
// if (req.body.headOffice) {
//   update['personaldata.headOffice'] = req.body.headOffice;
// }
// if (req.body.description) {
//   update['personaldata.description'] = req.body.description;
// }

// try {
//   const updatedUser = await User.findOneAndUpdate(
//     { email: email },
//     { $set: update },
//     { new: true }
//   ).populate('personaldata');

//   res.status(200).json(updatedUser);
// } catch (err) {
//   console.error(err);
//   res.status(500).json({ message: 'An error occurred while updating the user' });
// }
// const { email } = req.params;
//   const update = {};

//   // check which fields are present in the request body and add them to the update object
//   if (req.body.name) {
//     update['personaldata.name'] = req.body.name;
//   }
//   if (req.body.phone) {
//     update['personaldata.phone'] = req.body.phone;
//   }
//   if (req.body.noOfEmployee) {
//     update['personaldata.noOfEmployee'] = req.body.noOfEmployee;
//   }
//   if (req.body.headOffice) {
//     update['personaldata.headOffice'] = req.body.headOffice;
//   }
//   if (req.body.description) {
//     update['personaldata.description'] = req.body.description;
//   }
//   if (req.body.profileimage) {
//     update['personaldata.profileimage'] = req.body.profileimage;
//   }

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { email: email },
//       { $set: update },
//       { new: true }
//     ).populate('personaldata');

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred while updating the user' });
//   }

  // };
  

  
    
// module.exports = userService;


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Company, User } = require('../models/credential');

// const userService = {};

// userService.addUser = (req, res) => {
//     // create a new company document
//     const company = new Company({
//         name: req.body.name,   
//         phone: req.body.phone,
//       noOfEmployee: req.body.noOfEmployee,
//       headOffice: req.body.headOffice
//     });
  
//     // save the company document
//     company.save().then((company) => {
//       // create a new user and link it to the company
//       const user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//         confirm: req.body.confirm,
//         company: company._id,
//         isFromSignupPage: true // set the flag to true
//       });
  
//       // hash the password and confirm fields
//       bcrypt.hash(user.password, 10, function (err, hashedPass) {
//         if (err) {
//           res.json({ error: err });
//         } else {
//           user.password = hashedPass;
//           bcrypt.hash(user.confirm, 10, function (err, hashedConfirm) {
//             if (err) {
//               res.json({ error: err });
//             } else {
//               user.confirm = hashedConfirm;
  
//               // save the user document
//               user.save().then((savedUser) => {
//                 const token = jwt.sign(
//                   { userId: savedUser._id },
//                   process.env.JWT_TOKEN_KEY
//                 );
  
//                 res.json({
//                   message: 'User added successfully',
//                   user: savedUser,
//                   token: token,
//                 });
//               })
//               .catch(error => {
//                 res.json({
//                   message: 'An error occurred while saving the user',
//                   error: error
//                 });
//               });
//             }
//           });
//         }
//       });
//     })
