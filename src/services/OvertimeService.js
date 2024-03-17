import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
dotenv.config();

export const getOvertimeServices = async () => {
    try {
        const result = await poolRequest().query("SELECT * FROM Overtime");
        return result.recordset;
    } catch (error) {
        return error.message;
    }
};

export const addOvertimeService = async (overtime) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, overtime.EmployeeID)
            .input('Date', sql.Date, overtime.Date)
            .input('Hours', sql.Int, overtime.Hours)
            .input('Minutes', sql.Int, overtime.Minutes)
            .input('Rate', sql.Decimal(10, 2), overtime.Rate)
            .query("INSERT INTO Overtime (EmployeeID, Date, Hours, Minutes, Rate) VALUES (@EmployeeID, @Date, @Hours, @Minutes, @Rate)");
        return result;
    } catch (error) {
        return error;
    }
};

export const getOvertimeByEmailService = async (EmployeeID) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, EmployeeID)
            .query("SELECT * FROM Overtime WHERE EmployeeID = @EmployeeID");

        return result.recordset;
    } catch (error) {
        throw error;
    }
};

// Example authentication function for Overtime
export const findByCredentialsService = async (overtime) => {
    try {
        // Implement your authentication logic here
    } catch (error) {
        return error;
    }
};

export const updateOvertimeService = async (overtime) => {
    try {
        const result = await poolRequest()
            .input('OvertimeID', sql.Int, overtime.OvertimeID)
            .input('Date', sql.Date, overtime.Date)
            .input('Hours', sql.Int, overtime.Hours)
            .input('Minutes', sql.Int, overtime.Minutes)
            .input('Rate', sql.Decimal(10, 2), overtime.Rate)
            .query("UPDATE Overtime SET Date = @Date, Hours = @Hours, Minutes = @Minutes, Rate = @Rate WHERE OvertimeID = @OvertimeID");
        return result;
    } catch (error) {
        return error;
    }
};

export const deleteOvertimeService = async (OvertimeID) => {
    try {
        const result = await poolRequest()
            .input('OvertimeID', sql.Int, OvertimeID)
            .query("DELETE FROM Overtime WHERE OvertimeID = @OvertimeID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Overtime entry not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

export const getOvertimeByIdService = async (OvertimeID) => {
    try {
        const result = await poolRequest()
            .input('OvertimeID', sql.Int, OvertimeID)
            .query("SELECT * FROM Overtime WHERE OvertimeID = @OvertimeID");

        if (result.recordset.length === 0) {
            throw new Error('Overtime entry not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
};

