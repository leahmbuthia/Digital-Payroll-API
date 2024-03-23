import { getDeductionByIdService, addDeductionService, updateDeductionService, deleteDeductionService, getAllDeductionsService } from "../services/DeductionService.js"; // Updated import statements
import { sendBadRequest, sendCreated, sendNotFound, sendServerError } from "../helper/helperFunctions.js";
import { DeductionValidator } from "../validators/DeductionValidator.js"; // Updated import statement
import logger from "../utils/logger.js";

// Function to fetch all deductions
export const getDeductions = async (req, res) => {
    try {
        const results = await getAllDeductionsService(); // Assuming you have a service function to fetch all deductions
       const deduction = results.recordset
        res.status(200).json({ deduction:deduction });
    } catch (error) {
        logger.error("Error fetching all Deductions:", error);
        sendServerError(res, error);
    }
}

// Function to fetch a deduction by ID
export const getDeductionById = async (req, res) => {
    try {
        const DeductionID = req.params.DeductionID;
        const deduction = await getDeductionByIdService(DeductionID);
        
        if (deduction) {
            res.status(200).json({ deduction });
        } else {
            sendNotFound(res, 'Deduction not found');
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
}

// Function to create a new deduction
export const createDeduction = async (req, res) => {
    try {
        const { EmployeeID, NHIF, NSSF, PAYE } = req.body;
        
        // Calculate total deductions
        const TotalDeductions = NHIF + NSSF + PAYE;

        // Validate deduction data
        const { error } = DeductionValidator({ EmployeeID, NHIF, NSSF, PAYE, TotalDeductions });
        
        if (error) {
            sendBadRequest(res, error.details[0].message);
        } else {
            // Add deduction to the database
            const result = await addDeductionService(EmployeeID, NHIF, NSSF, PAYE, TotalDeductions);
            
            if (result.message) {
                sendServerError(res, result.message);
            } else {
                sendCreated(res, 'Deduction created successfully');
            }
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
}


// Function to update an existing deduction
export const updateDeduction = async (req, res) => {
    try {
        const {DeductionID} = req.params;
        const updateDeductionData = req.body;
        const existingDeduction = await getDeductionByIdService(DeductionID)


        if (!existingDeduction){
            return res.status(400).json({
                message: "Attendance Found"
            });
        }
        // const { NHIF, NSSF, PAYE, TotalDeductions } = req.body;
        const result = await updateDeductionService(DeductionID, updateDeductionData);
        
        if (result instanceof Error){
            return res.status(500).json({
                message: 'Attendance updated successfully'
            });
         }else{
            return res.status(200).json({
                message: 'Employee update successfully'
            });
         }
        } catch (error) {
        return res.status(500).json({
          message: 'Deduction not found'
        });
            
    }
};
    

// Function to delete a deduction
export const deleteDeduction = async (req, res) => {
    try {
        const DeductionID = req.params.DeductionID;
        const result = await deleteDeductionService(DeductionID);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Deduction deleted successfully' });
        } else {
            sendNotFound(res, 'Deduction not found');
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
}
