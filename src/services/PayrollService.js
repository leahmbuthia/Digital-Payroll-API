import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
import { PayrollValidator } from "../validators/PayrollValidator.js";
dotenv.config();


// Function to get all payrolls
export const getAllPayrollsService = async () => {
    try {
        const query = `
            SELECT 
                Employee.FirstName,
                Payroll.*,
                Deduction.*
            FROM 
                Employee
            INNER JOIN 
                Payroll ON Employee.EmployeeID = Payroll.EmployeeID
            INNER JOIN 
                Deduction ON Employee.EmployeeID = Deduction.EmployeeID;
        `;
        
        const result = await poolRequest().query(query);
        return result;
    } catch (error) {
        throw error;
    }
};

// Function to add a new payroll
export const addPayrollService = async (payroll) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, payroll.EmployeeID)
            .input('GrossPay', sql.Decimal(10, 2), payroll.GrossPay)
            .input('Deductions', sql.Decimal(10, 2), payroll.Deductions)
            .input('NetPay', sql.Decimal(10, 2), payroll.NetPay)
            .input('PayrollDate', sql.Date, payroll.PayrollDate)
            .query("INSERT INTO Payroll (EmployeeID, GrossPay, Deductions, NetPay, PayrollDate) VALUES (@EmployeeID, @GrossPay, @Deductions, @NetPay, @PayrollDate);");
        
        return result;
    } catch (error) {
        throw error;
    }
};
// Function to get payroll by EmployeeID
 export const getPayrollByEmployeeIDService = async (employeeID) => {
    try {
      const result = await poolRequest()
        .input('EmployeeID', sql.Int, employeeID)
        .query("SELECT * FROM Payroll WHERE EmployeeID = @EmployeeID");
      
      return result.recordset[0]; // Return the first matching payroll record if found
    } catch (error) {
      throw error;
    }
  };

// Function to get payroll by ID
export const getPayrollByIdService = async (payrollID) => {
    try {
        const result = await poolRequest()
            .input('PayrollID', sql.Int, payrollID)
            .query(` SELECT 
            Employee.FirstName,
            Payroll.*,
            Deduction.*
        FROM 
            Employee
        INNER JOIN 
            Payroll ON Employee.EmployeeID = Payroll.EmployeeID
        INNER JOIN 
            Deduction ON Employee.EmployeeID = Deduction.EmployeeID WHERE PayrollID = @PayrollID`);

        if (result.recordset.length === 0) {
            throw new Error('Payroll not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
};

// Function to update a payroll
export const updatePayrollService = async (PayrollID, updatedPayrollData) => {
    try {
        const { EmployeeID, GrossPay, Deductions, NetPay, PayrollDate } = updatedPayrollData;
       const result = await poolRequest()
            .input('PayrollID', sql.Int, PayrollID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('GrossPay', sql.Decimal(10, 2), GrossPay)
            .input('Deductions', sql.Decimal(10, 2), Deductions)
            .input('NetPay', sql.Decimal(10, 2), NetPay)
            .input('PayrollDate', sql.Date, PayrollDate)
            .query("UPDATE Payroll SET EmployeeID = @EmployeeID, GrossPay = @GrossPay, Deductions = @Deductions, NetPay = @NetPay, PayrollDate = @PayrollDate WHERE PayrollID = @PayrollID;");
        
        return result;
    } catch (error) {
        throw error;
    }
};

// Function to delete a payroll
export const deletePayrollService = async (payrollID) => {
    try {
        const result = await poolRequest()
            .input('PayrollID', sql.Int, payrollID)
            .query("DELETE FROM Payroll WHERE PayrollID = @PayrollID");

        if (result.recordset.length === 0)  {
            throw new Error('Payroll not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
};
