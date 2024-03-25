import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { sendServerError } from "../helper/helperFunctions.js";
import logger from "../utils/logger.js";
import emailTemp from "../emailTemp.js";
import { sendBadRequest, sendCreated, sendNotFound } from "../helper/helperFunctions.js";
import { PayrollValidator} from "../validators/PayrollValidator.js";

import { addPayrollService, deletePayrollService, getAllPayrollsService, getPayrollByEmployeeIDService, getPayrollByIdService, updatePayrollService } from "../services/PayrollService.js";


export const getPayroll = async (req, res) => {
    try {
        // Retrieve all payrolls
        const results = await getAllPayrollsService();
        const payroll = results.recordset
        res.status(200).json({payroll:payroll})
        
    } catch (error) {
        console.error("Error fetching overtime:", error);
        sendServerError(res, error);
    }
};
export const getPayrollById = async (req, res) => {
  try {
      const PayrollID = req.params.PayrollID;
      const payroll = await getPayrollByIdService(PayrollID);

      if (payroll){
          return res.status(200).json({payroll});
      }else{
          return sendNotFound(res, 'Payroll not found');
      }
  } catch (error) {
      return sendServerError(res, error.message)
  }
};
export const getPayrollByEmployeeID = async (req, res) => {
  try {
    const EmployeeID = req.params.EmployeeID;
    const payroll = await getPayrollByEmployeeIDService(EmployeeID); // Call the service function to fetch payroll details
    
    if (payroll) {
      return res.status(200).json({ payroll });
    } else {
      return res.status(404).json({ message: 'Payroll for EmployeeID not found' }); // Return a 404 status if payroll is not found
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' }); // Return a 500 status for any internal server error
  }
};

// export const createPayroll = async (req, res) => {
//   try {
//     const { EmployeeID, GrossPay, Deductions, NetPay, PayrollDate } = req.body;

//     // Check if the EmployeeID already exists in the database
//     const existingPayroll = await getPayrollByEmployeeIDService(EmployeeID);
//     if (existingPayroll) {
//       return res.status(400).json({ message: "Employee already has a payroll" });
//     }

//     // Validate payroll data
//     const { error } = PayrollValidator(req.body);
//     if (error) {
//       return sendBadRequest(res, error.details[0].message);
//     }

//     // Add the payroll to the database
//     const result = await addPayrollService({ EmployeeID, GrossPay, Deductions, NetPay, PayrollDate });

//     // Handle response
//     if (result.message) {
//       sendServerError(res, result.message);
//     } else {
//       // Return success response
//       res.status(201).json({ message: "Payroll created successfully" });
//     }
//   } catch (error) {
//     sendServerError(res, error.message);
//   }
// };
export const createPayroll = async (req, res) => {
  try {
    const { EmployeeID, NHIF, NSSF, GrossPay, PayrollDate } = req.body;

    // Calculate PAYE (assuming PAYE is 16% of GrossPay)
    const PAYE = GrossPay * 0.16;

    // Calculate Total Deductions
    const TotalDeductions = NHIF + NSSF + PAYE; // Corrected calculation

    // Calculate Net Pay
    const NetPay = GrossPay - TotalDeductions;

    // Add the payroll to the database
    const result = await addPayrollService({ EmployeeID, NHIF, NSSF, PAYE, TotalDeductions, GrossPay, NetPay, PayrollDate });

    // Handle response
    if (result.message) {
      sendServerError(res, result.message);
    } else {
      // Return success response with NetPay included
      res.status(201).json({ message: "Payroll created successfully", NetPay ,TotalDeductions});
    }
  } catch (error) {
    sendServerError(res, error.message);
  }
};




export const updatePayroll = async (req, res) => {
  try {
    const {PayrollID} =req.params;
    const updatedPayrollData =req.body;
    const existingPayroll = await getPayrollByIdService(PayrollID);

    if(!existingPayroll){
      return res.status(400).json({
        message:"Payroll found"
      });
    }
    const result = await updatePayrollService(PayrollID, updatedPayrollData);

    if (result instanceof Error){
      return res.status(500).json({
        message: 'Payroll updated successfully'
      });
    }else{
      return res.status(200).json({
        message: 'Payroll update successfully'
      });
    }
  } catch (error) {
    sendServerError(res, error.message);
  }
};

export const deletePayroll = async (req, res) => {
  try {
    const PayrollID = req.params.PayrollID;
    const result = await deletePayrollService(PayrollID);

    if (result.rowsAffected[0] > 0) {
      return res.status(200).json({ message: "Payroll deleted successfully" });
    } else {
      return res.status(404).json({ error: error.message});
    }
  } catch (error) {
   
  }
};
