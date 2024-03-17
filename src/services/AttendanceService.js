import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const addAttendanceService = async (attendance) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, attendance.EmployeeID)
            .input('Date', sql.Date, attendance.Date)
            .input('TimeIn', sql.Time, attendance.TimeIn)
            .input('TimeOut', sql.Time, attendance.TimeOut)
            .query("INSERT INTO Attendance (EmployeeID, Date, TimeIn, TimeOut) VALUES (@EmployeeID, @Date, @TimeIn, @TimeOut)");

        return result.rowsAffected.length > 0; // Check if any rows were affected
    } catch (error) {
        return error;
    }
};

export const updateAttendanceService = async (attendance) => {
    try {
        const result = await poolRequest()
            .input('AttendanceID', sql.Int, attendance.AttendanceID)
            .input('EmployeeID', sql.Int, attendance.EmployeeID)
            .input('Date', sql.Date, attendance.Date)
            .input('TimeIn', sql.Time, attendance.TimeIn)
            .input('TimeOut', sql.Time, attendance.TimeOut)
            .query("UPDATE Attendance SET EmployeeID = @EmployeeID, Date = @Date, TimeIn = @TimeIn, TimeOut = @TimeOut WHERE AttendanceID = @AttendanceID");

        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteAttendanceService = async (AttendanceID) => {
    try {
        const result = await poolRequest()
            .input('AttendanceID', sql.Int, AttendanceID)
            .query("DELETE FROM Attendance WHERE AttendanceID = @AttendanceID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Attendance record not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
}

export const getAttendanceByEmployeeService = async (EmployeeID) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, EmployeeID)
            .query("SELECT Attendance.*, Employee.FirstName FROM Attendance JOIN Employee ON Attendance.EmployeeID = Employee.EmployeeID WHERE Attendance.EmployeeID = @EmployeeID");

        return result.recordset;
    } catch (error) {
        throw error;
    }
}

export const getAttendanceService =async ()=>{
    try {
        const result = await poolRequest().query("SELECT * FROM Attendance");
        return result.recordset;
    } catch (error) {
        return error.message;
        
    }
}

export const getAttendanceByIdService = async (AttendanceID) => {
    try {
        const result = await poolRequest()
            .input('AttendanceID', sql.Int, AttendanceID)
            .query("SELECT * FROM Attendance WHERE AttendanceID = @AttendanceID");

        if (result.recordset.length === 0) {
            throw new Error('Attendance record not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}
