const EmployeeSpecificModel = require("../models/specifieEmployeeDetails");


exports.gettingspecificdetails = async function (req, res) {

    // const id = req.params.id;


    // try {
    //     const employees = await EmployeeModel.find({}).select("name email dateOfBirth mobile");
    
    //     res.status(200).json(employees);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "Server error" });
    //   }
    // const id = req.params.id;

    // try {
    //   const employeeDetails = await EmployeeSpecificModel.findById(id).populate(
    //     "employee",
    //     "name email dateOfBirth mobile"
    //   );
  
    //   if (!employeeDetails) {
    //     return res.status(404).json({ error: "Employee details not found" });
    //   }
  
    //   // Send employeeDetails and additional data to another collection
    //   const someOtherData = {
    //     employee: employeeDetails.employee._id,
    //     noOfEmployee: req.body.noOfEmployee,
    //     headoffice: req.body.headoffice
    //   };
    //   await SomeOtherCollection.create(someOtherData);
  
    //   res.status(200).json(employeeDetails);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: "Server error" });
    // }  
    // const id = req.params._id;

    // EmployeeSpecificModel.findById(id)
    //   .populate("employee", "name email dateOfBirth mobile")
    //   .then(async (employeeDetails) => {
    //     if (!employeeDetails) {
    //       return res.status(404).json({ error: "Employee details not found" });
    //     }
    
    //     // Send employeeDetails and additional data to another collection
    //     const someOtherData = {
    //       employee: employeeDetails.employee._id,
    //       noOfEmployee: req.body.noOfEmployee,
    //       headoffice: req.body.headoffice,
    //     };
    //     await SomeOtherCollection.create(someOtherData);
    
    //     res.status(200).json(employeeDetails);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     res.status(500).json({ error: "Server error" });
    //   });
    try {
        const employees = await EmployeeModel.find({}, { name: 1, mobile: 1, dateOfBirth: 1, email: 1 }).lean();
    
        const employeeDetails = employees.map((employee) => {
          return {
            uid: employee.uid,
            name: employee.name,
            mobile: employee.mobile,
            dateOfBirth: employee.dateOfBirth,
            email: employee.email,
            noOfEmployee: req.body.noOfEmployee,
            headoffice: req.body.headoffice,
          };
        });
    
        await EmployeeDetailsModel.create(employeeDetails);
    
        res.status(201).json({ message: 'Employee details created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
      }
 };



