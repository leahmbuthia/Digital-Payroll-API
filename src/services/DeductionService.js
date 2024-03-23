import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const getAllDeductionsService = async () => {
    try {
        const result = await poolRequest().query("SELECT * FROM Deduction");
        return result
    } catch (error) {
        throw error;
    }
}

export const getDeductionByIdService = async (DeductionID) => {
    try {
        const result = await poolRequest()
            .input('DeductionID', sql.Int, DeductionID)
            .query("SELECT * FROM Deduction WHERE DeductionID = @DeductionID");

        if (result.recordset.length === 0) {
            throw new Error('Deduction not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

export const addDeductionService = async (employeeID, NHIF, NSSF, PAYE, TotalDeductions) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, employeeID)
            .input('NHIF', sql.Decimal, NHIF)
            .input('NSSF', sql.Decimal, NSSF)
            .input('PAYE', sql.Decimal, PAYE)
            .input('TotalDeductions', sql.Decimal, TotalDeductions)
            .query("INSERT INTO Deduction (EmployeeID, NHIF, NSSF, PAYE, TotalDeductions) VALUES (@EmployeeID, @NHIF, @NSSF, @PAYE, @TotalDeductions)");

        return result;
    } catch (error) {
        throw error;
    }
}

export const updateDeductionService = async (DeductionID, updateDeductionData) => {
    try {
        const {EmployeeID, NHIF, NSSF, PAYE, TotalDeductions} = updateDeductionData;
        const result = await poolRequest()
            .input('DeductionID', sql.Int, DeductionID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('NHIF', sql.Decimal, NHIF)
            .input('NSSF', sql.Decimal, NSSF)
            .input('PAYE', sql.Decimal, PAYE)
            .input('TotalDeductions', sql.Decimal, TotalDeductions)
            .query("UPDATE Deduction SET EmployeeID = @EmployeeID,NHIF = @NHIF, NSSF = @NSSF, PAYE = @PAYE, TotalDeductions = @TotalDeductions WHERE DeductionID = @DeductionID");

        return result;
    } catch (error) {
        console.log("error is ", error);
        return error;
    }
}

export const deleteDeductionService = async (DeductionID) => {
    try {
        const result = await poolRequest()
            .input('DeductionID', sql.Int, DeductionID)
            .query("DELETE FROM Deduction WHERE DeductionID = @DeductionID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Deduction not found');
        }

        return result;
    } catch (error) {
        throw error;
    }
}
