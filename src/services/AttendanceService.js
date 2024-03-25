import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
dotenv.config();

export const addAttendanceService = async (attendance) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, attendance.EmployeeID)
            .input('CreatedDate', sql.Date, attendance.CreatedDate)
            .input('TimeIn', sql.Time, attendance.TimeIn)
            .input('TimeOut', sql.Time, attendance.TimeOut)
            .query(`
              INSERT INTO Attendance (EmployeeID, CreatedDate, TimeIn, TimeOut) 
              OUTPUT INSERTED.AttendanceID 
              VALUES (@EmployeeID, @CreatedDate, @TimeIn, @TimeOut)
            `);

        return result.recordset[0]; // Return the inserted record, including AttendanceID
    } catch (error) {
        throw error;
    }
};


export const updateAttendanceService = async (AttendanceID, updatedAttendance) => {
    try {
        const { TimeOut } = updatedAttendance;
        const result = await poolRequest()
            .input('AttendanceID', sql.Int, AttendanceID)
            // .input('EmployeeID', sql.Int, EmployeeID)
            // .input('CreatedDate', sql.DateTime, CreatedDate)
            // .input('TimeIn', sql.Time, TimeIn)  
            .input('TimeOut', sql.Time, TimeOut) 
            .query("UPDATE Attendance SET TimeOut = @TimeOut WHERE AttendanceID = @AttendanceID");

        return result;
    } catch (error) {
        console.log("error is ", error);
        return error;
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
export const findAttendanceByEmployeeIDAndDate = async (EmployeeID, Date) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('Date', sql.Date, Date)
            .query("SELECT * FROM Attendance WHERE EmployeeID = @EmployeeID AND CONVERT(date, CreatedDate) =@Date");

        if (result.recordset.length === 0) {
            return null; // No attendance record found for the provided EmployeeID and Date
        }

        return result.recordset[0]; // Return the first attendance record found
    } catch (error) {
        throw error;
    }
}


export const getAttendanceByIDService = async (AttendanceID) => {
    try {
        const result = await poolRequest()
            .input('AttendanceID', sql.Int, AttendanceID)
            .query("SELECT Attendance.*, Employee.FirstName , Employee.LastName FROM Attendance JOIN Employee ON Attendance.EmployeeID = Employee.EmployeeID WHERE AttendanceID = @AttendanceID");
        // Check if any user is found
        if (result.recordset.length === 0) {
            throw new Error('User not found');
        }
          // Return the first (and presumably only) user found
          return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

export const getAttendanceService =async ()=>{
    try {
        const result = await poolRequest()
        .query("SELECT Attendance.*, Employee.FirstName , Employee.LastName FROM Attendance JOIN Employee ON Attendance.EmployeeID = Employee.EmployeeID");
        // return result.recordset;
        return result
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
