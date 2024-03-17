import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

export const getScheduleServices = async () => {
    try {
        const result = await poolRequest().query("SELECT * FROM Schedule");
        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

export const addScheduleService = async (schedule) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, schedule.EmployeeID)
            .input('StartTime', sql.Time, schedule.StartTime)
            .input('EndTime', sql.Time, schedule.EndTime)
            .input('Days', sql.VarChar, schedule.Days)
            .query("INSERT INTO Schedule (EmployeeID, StartTime, EndTime, Days) VALUES (@EmployeeID, @StartTime, @EndTime, @Days)");
        return result;
    } catch (error) {
        return error;
    }
}

export const updateScheduleService = async (schedule) => {
    try {
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, schedule.ScheduleID)
            .input('EmployeeID', sql.Int, schedule.EmployeeID)
            .input('StartTime', sql.Time, schedule.StartTime)
            .input('EndTime', sql.Time, schedule.EndTime)
            .input('Days', sql.VarChar, schedule.Days)
            .query("UPDATE Schedule SET EmployeeID = @EmployeeID, StartTime = @StartTime, EndTime = @EndTime, Days = @Days WHERE ScheduleID = @ScheduleID");
        return result;
    } catch (error) {
        return error;
    }
}

export const deleteScheduleService = async (scheduleID) => {
    try {
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, scheduleID)
            .query("DELETE FROM Schedule WHERE ScheduleID = @ScheduleID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Schedule not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
}

export const getScheduleByIdService = async (scheduleID) => {
    try {
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, scheduleID)
            .query("SELECT * FROM Schedule WHERE ScheduleID = @ScheduleID");

        if (result.recordset.length === 0) {
            throw new Error('Schedule not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}
