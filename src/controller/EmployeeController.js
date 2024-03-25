import {
  addEmployeeService,
  deleteEmployeeService,
  findByCredentialsService,
  getEmployeeByEmailService,
  getEmployeeByIdService,
  getEmployeeServices,
  updateEmployeeService,
} from "../services/EmployeeServices.js";
import {
  checkIfValuesIsEmptyNullUndefined,
  orderData,
  paginate,
  sendBadRequest,
  sendCreated,
  sendNotFound,
} from "../helper/helperFunctions.js";
import bcrypt from "bcrypt";
// import jwt  from 'jsonwebtoken';
import { sendServerError } from "../helper/helperFunctions.js";
import nodemailer from "nodemailer";
// import logger from './src/utils/logger.js';
import logger from "../utils/logger.js";
import emailTemp from "../emailTemp.js";
import {
  EmployeeLoginValidator,
  EmployeeValidator,
} from "../validators/EmployeeValidator.js";
import jwt from "jsonwebtoken";


export const loginEmployee = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const { error } = EmployeeLoginValidator(req.body);
    if (error) {
      return sendBadRequest(res, error.details[0].message);
    }
    // Check if the user exists
    const employee = await getEmployeeByEmailService(Email);
    // console.log("employee", employee);
    if (!employee) {
      return sendNotFound(res, "User not found");
    } else {
      const loggedInUser = await findByCredentialsService({ Email, Password });
      // console.log("logged in", loggedInUser);

      res.json({ message: "Logged in successfully", loggedInUser });
    }
  } catch (error) {
    sendServerError(res, error.message);
  }
};

export const getEmployee = async (req, res) => {
  //localhost:3000/todos?page=1&limit=10
  try {
    const data = await getEmployeeServices();
    if (data.length === 0) {
      sendNotFound(res, "No Users found");
    } else {
      if (!req.query.page || !req.query.limit) {
        if (req.query.order) {
          res.status(200).json(orderData(data, req.query.order));
        } else {
          res.status(200).json(data);
        }
      } else {
        if (req.query.order) {
          paginate(orderData(data, req.query.order), req, res);
        } else {
          paginate(data, req, res);
        }
      }
    }
  } catch (error) {
    sendServerError(res, error);
  }
};



export const createEmployee = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Address,
      DOB,
      Email,
      Gender,
      Position,
      PhoneNo,
      Password,
      Schedule,
      Role,
    } = req.body; // Include 'Role' in destructuring

    // Check if the user already exists
    const existingEmployee = await getEmployeeByEmailService(Email);
    if (existingEmployee) {
      return res
        .status(400)
        .send("User with the provided email already exists");
    } else {
      // Validate employee data
      const { error } = EmployeeValidator({
        FirstName,
        LastName,
        Address,
        DOB,
        Email,
        Gender,
        Position,
        PhoneNo,
        Password,
        Schedule,
        Role,
      }); // Include 'Role' in validation
      if (error) {
        return res.status(400).send(error.details[0].message);
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 8);
        const registeredEmployee = {
          FirstName,
          LastName,
          Address,
          DOB,
          Email,
          Gender,
          Position,
          PhoneNo,
          Password: hashedPassword,
          Schedule,
          Role,
        }; // Include 'Role'

        // Add the employee to the database
        const result = await addEmployeeService(registeredEmployee);

        if (result.message) {
          sendServerError(res, result.message);
        } else {
          // Generate JWT token
          const token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });


          await sendMail(Email);
          // Send JWT token along with success response
          res.status(201).json({ message: "User created successfully", token });
        }
      }
    }
  } catch (error) {
    sendServerError(res, error.message);
  }
};

export const sendMail = async (email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to Our Digital Payroll!",
    // text: 'test 2 sending dummy emails!'
  //   html: `<div style="font-family: Arial, sans-serif; background:linear-gradient(to left,rgba(255,153,0,1),#007bff); max-width: 600px; margin: 0 auto;">
  //   <p style="font-size: 18px; font-weight: bold;">Dear ${user.Firstname},</p>
  //   <p style="font-size: 16px;">Thank you for registering. Here are your details:</p>
  //   <ul style="font-size: 16px;">
  //     <li><strong>Firstname:</strong> ${user.FirstName}</li>
  //     <li><strong>Lastname:</strong> ${user.Lastname}</li>
  //     <li><strong>Email:</strong> ${user.Email}</li>
  //     <li><strong>Password:</strong> ${user.Password}</li>
  //   </ul>
  //   <p style="font-size: 16px;">Regards,<br/>Your Application Team</p>
  // </div>`

  };
  try {
    logger.info("Sending mail....");
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
        res.status(500).send(error);
      } else {
        logger.info(`Email sent: ${info.response}`);
        res.status(500).send(error);
      }
    });
  } catch (error) {
    logger.error(error);
  }
}; 

export const getByEmployeeById = async (req, res) => {
  try {
    const EmployeeID = req.params.EmployeeID;
    const user = await getEmployeeByIdService(EmployeeID);

    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { EmployeeID } = req.params;
    const updatedEmployeeData = req.body;

    // Check if the employee exists
    const existingEmployee = await getEmployeeByIdService(EmployeeID);
    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    // Update the employee
    const result = await updateEmployeeService(EmployeeID, updatedEmployeeData);

    if (result instanceof Error) {
      console.error("Error updating employee:", result);
      return res.status(500).json({
        message: 'Internal server error'
      });
    } else {
      return res.status(200).json({
        message: 'Employee updated successfully'
      });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const EmployeeID = req.params.EmployeeID;
    const result = await deleteEmployeeService(EmployeeID);

    // Check if any rows are affected (user deleted)
    if (result.rowsAffected[0] > 0) {
      // Return a success message or any relevant data
      return res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      // If no user is deleted, return an error
      return res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ error: error.message });
  }
};

