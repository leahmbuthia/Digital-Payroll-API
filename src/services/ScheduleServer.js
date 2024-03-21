import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
dotenv.config();

export const addScheduleService = async (schedule) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, schedule.EmployeeID)
            .input('StartTime', sql.Time, schedule.StartTime)
            .input('EndTime', sql.Time, schedule.EndTime)
            .input('Days', sql.VarChar(255), schedule.Days)
            .query(`INSERT INTO Schedule (EmployeeID, StartTime, EndTime, Days) VALUES (@EmployeeID, @StartTime, @EndTime, @Days)`);

        return result;
    } catch (error) {
        throw error;
    }
};

export const updateScheduleService = async (ScheduleID, updatedScheduleData) => {
    try {
        const { EmployeeID, StartTime, EndTime, Days } = updatedScheduleData;
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, ScheduleID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('StartTime', sql.Time, StartTime)
            .input('EndTime', sql.Time, EndTime)
            .input('Days', sql.VarChar(255), Days)
            .query("UPDATE Schedule SET EmployeeID = @EmployeeID, StartTime = @StartTime, EndTime = @EndTime, Days = @Days WHERE ScheduleID = @ScheduleID");

        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteScheduleService = async (ScheduleID) => {
    try {
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, ScheduleID)
            .query("DELETE FROM Schedule WHERE ScheduleID = @ScheduleID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Schedule record not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
}

export const getScheduleByIDService = async (ScheduleID) => {
    try {
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, ScheduleID)
            .query("SELECT * FROM Schedule WHERE ScheduleID = @ScheduleID");

        if (result.recordset.length === 0) {
            throw new Error('Schedule record not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

export const getScheduleService = async () => {
    try {
        const result = await poolRequest()
            .query("SELECT * FROM Schedule");
        return result.recordset;
    } catch (error) {
        throw error;
    }
}
