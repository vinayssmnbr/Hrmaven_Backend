const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  uid: {
    type: Number,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  city:{
    type:String
},
postalCode:{
    type:Number
},
state:{
    type:String
},
mobile:{
    type:Number
},
address:{
    type:String
},
email:{
    type:String
},
fatherName:{
  type:String
},
motherName:{
  type:String
},
maritalStatus:{
  type:String,
  enum:['Married','Unmarried']
},
bloodGroup:{
  type:String,
  enum:['A+','A-','B+','B-','O+','O-','AB+','AB-']
},
nationality:{
  type:String
},
dateOfBirth:{
  type:Date
},
gender:{
  type:String,
  enum:['Male','Female','Other']
},
bankname:{
  type:String
},
accountno:{
  type:Number
},
ifsc:{
  type:String
},
adhaarno:{
  type:Number
},
panno:{
  type:String
},
passport:{
  type:Number
},
matric:{
  type:String

},
matricPercent:{
  type:Number
},
inter:{
  type:String
},
interPercent:{
  type:Number
},
graduation:{
  type:String
},
graduationStream:{
  Type:String
},
graduationCgpa:{
  type:Number
},
pg:{
  type:String
},
pgStream:{
  type:String
},
pgCgpa:{
  type:String  
},
company:{
  type:String
},
duration:{
  from:Date,
  to:Date
},
designation:{
  type:String,
  enum:[ 'Software Developer', 'Forntend Developer', 'Full Stack Developer','UI/UX Designer']
},

});


employeeSchema.index({ name: "text" });
const EmployeeModel = mongoose.model("employee", employeeSchema);
module.exports =
  EmployeeModel
