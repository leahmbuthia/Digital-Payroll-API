
import { addEmployeeService, deleteEmployeeService, getEmployeeByEmailService, getEmployeeByIdService, getEmployeeServices, updateEmployeeService } from "../services/EmployeeServices.js"
import { checkIfValuesIsEmptyNullUndefined, orderData, paginate, sendCreated, sendNotFound} from "../helper/helperFunctions.js";
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import { sendServerError } from '../helper/helperFunctions.js';
import nodemailer from 'nodemailer'
// import logger from './src/utils/logger.js';
import logger from '../utils/logger.js';
import emailTemp from '../emailTemp.js';
import { EmployeeValidator } from '../validators/EmployeeValidator.js';
import { getAttendanceByEmployeeService } from '../services/AttendanceService.js';


export const loginEmployee = async (req, res) => {
    try {
        const { Email, Password } = req.body;
     
      const { error } = userLoginValidator(req.body);
      if (error) {
        return sendBadRequest(res, error.details[0].message);
      }   
      // Check if the user exists
      const employee = await getEmployeeByEmailService(Email);
      console.log("employee",employee);
      if (!employee) {
        return sendNotFound(res, "User not found");
      }else{
      const loggedInUser=await findByCredentialsService({Email, Password})
        console.log("logged in",loggedInUser);
    
      res.json({ message: "Logged in successfully",loggedInUser});
    }
    } catch (error) {
      sendServerError(res, error.message);
    }
  };

export const getEmployee = async (req, res) => { //localhost:3000/todos?page=1&limit=10    
        try {
            const data = await getEmployeeServices();
            if (data.length === 0) {
                sendNotFound(res, 'No Users found');
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
    }
   
export const createEmployee = async (req, res) => {

        try {
            const { FirstName, LastName, Address,DOB,Email,Gender,Position,PhoneNo, Password,Schedule, PhotoURL } = req.body;
            console.log(req.body);
        
            const existingEmployee = await getEmployeeByEmailService(Email);
            console.log(existingEmployee);
          if (existingEmployee) {
            return res.status(400).send("User with the provided email or username already exists");
          }else{
      
            const { error } = EmployeeValidator( { FirstName, LastName, Address,DOB,Email,Gender,Position,PhoneNo, Password,Schedule, PhotoURL });
            console.log("error",error);
            if (error) {
              return res.status(400).send(error.details[0].message);
            } else {
              const hashedPassword = await bcrypt.hash(Password, 8);
              const registeredEmployee =  { FirstName, LastName, Address,DOB,Email,Gender,Position,PhoneNo, Password,Schedule, PhotoURL };
        
              const result = await addEmployeeService(registeredEmployee);
        
              if (result.message) {
                sendServerError(res, result.message)
            } else {
                sendMail(registeredEmployee.Email);
                sendCreated(res, 'User created successfully');
            }
            }
          }
          } catch (error) {
            sendServerError(res, error.message);
          }
        }
    
 export const sendMail = async (email) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Welcome to social media platform!',
                // text: 'test 2 sending dummy emails!'
                html: emailTemp
            };
            try {
                logger.info('Sending mail....');
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
                const user = await getAttendanceByEmployeeService(EmployeeID);
                
                if (user) {
                    return res.status(200).json({ user });
                } else {
                    return res.status(404).json({ error: 'User not found' });
                }
            } catch (error) {
                // Handle any unexpected errors
                return res.status(500).json({ error: error.message });
            }
        }
        
        
    export const updateEmployee= async (req, res) => {
        try {
        const {FirstName, LastName, Address,DOB,Email,Gender,Position,PhoneNo, Password,Schedule, PhotoURL } = req.body;
        const EmployeeID = req.params.EmployeeID;
        const userToUpdate = await getEmployeeByIdService(EmployeeID);
            if (!userToUpdate) {
                sendNotFound(res, 'user not found');
            } else {
                if (checkIfValuesIsEmptyNullUndefined(req, res, req.body)) {
                    if (FirstName) {
                        userToUpdate.FirstName = FirstName;
                    }
                    if (LastName) {
                      userToUpdate.LastName = LastName;
                  }
                  if (Address) {
                    userToUpdate.Address = Address;
                }
                if (DOB) {
                  userToUpdate.DOB = DOB;
              }
                    if (Email) {
                        userToUpdate.Email = Email;
                    }
                    if (Gender) {
                      userToUpdate.Gender = Gender;
                  }
                  if (Position) {
                    userToUpdate.Position = Position;
                }
                if (PhoneNo) {
                  userToUpdate.PhoneNo = PhoneNo;
              }
                    if (Password) {
                        const hashedPassword = await bcrypt.hash(Password, 8);
                        userToUpdate.Password = hashedPassword;
                    }
                    if (Schedule) {
                        userToUpdate.Schedule = Schedule;
                    }
                    if (PhotoURL) {
                        userToUpdate.PhotoURL = PhotoURL;
                    }
                    await updateEmployeeService(userToUpdate);
                    sendCreated(res, 'Employee updated successfully');
                } else {
                    sendServerError(res, 'Please provide a completed field');
                }
            }
        } catch (error) {
          sendServerError(res, error.message); // Fixed typo: sendSeverError -> sendServerError
        }
    }


    export const deleteEmployee = async (req, res) => {
        try {
            const EmployeeID = req.params.EmployeeID;
            const result = await deleteEmployeeService(EmployeeID);
    
            // Check if any rows are affected (user deleted)
            if (result.rowsAffected[0] > 0) {
                // Return a success message or any relevant data
                return res.status(200).json({ message: 'Employee deleted successfully' });
            } else {
                // If no user is deleted, return an error
                return res.status(404).json({ error: 'Employee not found' });
            }
        } catch (error) {
            // Handle any unexpected errors
            return res.status(500).json({ error: error.message });
        }
    }
