import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
dotenv.config();

export const addOvertimeService = async (overtime) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, overtime.EmployeeID)
            .input('CreatedDate', sql.Date, overtime.CreatedDate)
            .input('Hours', sql.Int, overtime.Hours)
            .input('Minutes', sql.Int, overtime.Minutes)
            .input('Rate', sql.Decimal(10, 2), overtime.Rate)
            .query(`INSERT INTO Overtime (EmployeeID, CreatedDate, Hours, Minutes, Rate) VALUES (@EmployeeID, @CreatedDate, @Hours, @Minutes, @Rate)`);

        return result;
    } catch (error) {
        throw error;
    }
};

export const updateOvertimeService = async (OvertimeID, updatedOvertime) => {
    try {
        const { EmployeeID, CreatedDate, Hours, Minutes, Rate } = updatedOvertime;
        const result = await poolRequest()
            .input('OvertimeID', sql.Int, OvertimeID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('CreatedDate', sql.Date, CreatedDate)
            .input('Hours', sql.Int, Hours)
            .input('Minutes', sql.Int, Minutes)
            .input('Rate', sql.Decimal(10, 2), Rate)
            .query("UPDATE Overtime SET EmployeeID = @EmployeeID, CreatedDate = @CreatedDate, Hours = @Hours, Minutes = @Minutes, Rate = @Rate WHERE OvertimeID = @OvertimeID");

        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteOvertimeService = async (OvertimeID) => {
    try {
        const result = await poolRequest()
            .input('OvertimeID', sql.Int, OvertimeID)
            .query("DELETE FROM Overtime WHERE OvertimeID = @OvertimeID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Overtime record not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
}

export const findOvertimeByEmployeeIDAndDate = async (EmployeeID, Date) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('Date', sql.Date, Date)
            .query("SELECT * FROM Overtime WHERE EmployeeID = @EmployeeID AND CONVERT(date, CreatedDate) = @Date");

        if (result.recordset.length === 0) {
            return null; // No overtime record found for the provided EmployeeID and Date
        }

        return result.recordset[0]; // Return the first overtime record found
    } catch (error) {
        throw error;
    }
}


export const getOvertimeByIDService = async (OvertimeID) => {
    try {
        const result = await poolRequest()
            .input('OvertimeID', sql.Int, OvertimeID)
            .query("SELECT Overtime.*, Employee.FirstName FROM Overtime JOIN Employee ON Overtime.EmployeeID = Employee.EmployeeID WHERE OvertimeID = @OvertimeID");

        if (result.recordset.length === 0) {
            throw new Error('Overtime record not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

export const getOvertimeService = async () => {
    try {
        const result = await poolRequest()
            .query("SELECT * FROM Overtime");

        return result.recordset;
    } catch (error) {
        throw error;
    }
}
