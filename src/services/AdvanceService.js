import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";

export const addAdvanceService = async (advance) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.VarChar, advance.EmployeeID)
            .input('Date', sql.Date, advance.Date)
            .input('Amount', sql.Decimal(10, 2), advance.Amount)
            .query("INSERT INTO AdvanceCash (EmployeeID, Date, Amount) VALUES (@EmployeeID, @Date, @Amount)");
        return result;
    } catch (error) {
        throw error;
    }
};

export const getAdvanceByIdService = async (advanceId) => {
    try {
        const result = await poolRequest()
            .input('AdvanceCashID', sql.Int, advanceId)
            .query("SELECT * FROM AdvanceCash WHERE AdvanceCashID = @AdvanceCashID");

        if (result.recordset.length === 0) {
            throw new Error('Advance cash not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
};

export const updateAdvanceService = async (advanceId, advance) => {
    try {
        const result = await poolRequest()
            .input('AdvanceCashID', sql.Int, advanceId)
            .input('EmployeeID', sql.VarChar, advance.EmployeeID)
            .input('Date', sql.Date, advance.Date)
            .input('Amount', sql.Decimal(10, 2), advance.Amount)
            .query("UPDATE AdvanceCash SET EmployeeID = @EmployeeID, Date = @Date, Amount = @Amount WHERE AdvanceCashID = @AdvanceCashID");
        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteAdvanceService = async (advanceId) => {
    try {
        const result = await poolRequest()
            .input('AdvanceCashID', sql.Int, advanceId)
            .query("DELETE FROM AdvanceCash WHERE AdvanceCashID = @AdvanceCashID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Advance cash not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
};
