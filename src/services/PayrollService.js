import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
import { PayrollValidator } from "../validators/PayrollValidator.js";
dotenv.config();

// Function to add a new payroll
export const addPayrollService = async (payroll) => {
    try {
        // const { EmployeeID, GrossPay, PayrollDate } = payroll;
        
        // // Calculate PAYE (assuming PAYE is 16% of GrossPay)
        // const PAYE = GrossPay * 0.16;

        
        // const TotalDeductions = NHIF - NSSF - PAYE;

        // // Calculate Net Pay (GrossPay - TotalDeductions)
        // const NetPay = GrossPay - TotalDeductions;

        const result = await poolRequest()
            .input('EmployeeID', sql.Int, payroll.EmployeeID)
            .input('NHIF', sql.Decimal(12, 2), payroll.NHIF)
            .input('NSSF', sql.Decimal(12, 2), payroll.NSSF)
            .input('PAYE', sql.Decimal(12, 2), payroll.PAYE)
            .input('TotalDeductions', sql.Decimal(12, 2), payroll.TotalDeductions)
            .input('GrossPay', sql.Decimal(10, 2), payroll.GrossPay)
            .input('NetPay', sql.Decimal(10, 2), payroll.NetPay)
            .input('PayrollDate', sql.Date, payroll.PayrollDate)
            .query("INSERT INTO Payroll (EmployeeID, NHIF, NSSF, PAYE, TotalDeductions, GrossPay, NetPay, PayrollDate) VALUES (@EmployeeID, @NHIF, @NSSF, @PAYE, @TotalDeductions, @GrossPay, @NetPay, @PayrollDate);");
        
        return result;
    } catch (error) {
        return error;
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
            .query(`SELECT * FROM Payroll WHERE PayrollID = @PayrollID`);

        if (result.recordset.length === 0) {
            throw new Error('Payroll not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
};

// Function to update a payroll
export const updatePayrollService = async (payrollID, updatedPayrollData) => {
    try {
        const { GrossPay, PayrollDate } = updatedPayrollData;
        
        // Calculate PAYE (assuming PAYE is 16% of GrossPay)
        const PAYE = GrossPay * 0.16;
        const TotalDeductions = NHIF - NSSF - PAYE;

        // Calculate Net Pay (GrossPay - TotalDeductions)
        const NetPay = GrossPay - TotalDeductions;

        const result = await poolRequest()
            // .input('PayrollID', sql.Int, payrollID)
            // .input('EmployeeID', sql.Int, EmployeeID)
            .input('NHIF', sql.Decimal(12, 2), NHIF)
            .input('NSSF', sql.Decimal(12, 2), NSSF)
            // .input('PAYE', sql.Decimal(12, 2), PAYE)
            // .input('TotalDeductions', sql.Decimal(12, 2), TotalDeductions)
            .input('GrossPay', sql.Decimal(10, 2), GrossPay)
            // .input('NetPay', sql.Decimal(10, 2), NetPay)
            .input('PayrollDate', sql.Date, PayrollDate)
            .query("UPDATE Payroll SET NHIF = @NHIF, NSSF = @NSSF,GrossPay=@GrossPay,   WHERE PayrollID = @PayrollID;");

        
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

// Function to get all payrolls
export const getAllPayrollsService = async () => {
    try {
        const query = `
            SELECT 
                Employee.FirstName,Employee.LastName,
                Payroll.*
            FROM 
                Employee
            INNER JOIN 
                Payroll ON Employee.EmployeeID = Payroll.EmployeeID
        `;
        
        const result = await poolRequest().query(query);
        return result;
    } catch (error) {
        throw error;
    }
};
