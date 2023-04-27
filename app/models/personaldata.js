const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    noOfEmployee: {
      type: String,
      enum: ["0-50", "50-100", "100-150"],
      default: "0-50",
      required: true,
    },
    headOffice: {
      type: String,
      enum: ["Leeds United-Kingdom", "London United-Kingdom", "Manchester United-Kingdom"],
      default: "Leeds United-Kingdom",
      required: true,
    },
    description: {
      type: String,
    }
    // ,
    // hrUser: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'hrUser'
    // }
  }
)

const Userpersonal = mongoose.model("employeepersonaldata", companySchema);

// module.exports = {Company, Userpersonal };
module.exports =  Userpersonal ;
