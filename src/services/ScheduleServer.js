import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import dotenv from 'dotenv';
dotenv.config();


const calculateDuration = (startTime, endTime) => {
    console.log("StartTime:", startTime);
    console.log("EndTime:", endTime);

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    console.log("Start Date Object:", start);
    console.log("End Date Object:", end);

    const differenceInMillis = end - start;
    console.log("Difference in Milliseconds:", differenceInMillis);

    const hours = Math.floor(differenceInMillis / (1000 * 60 * 60));
    console.log("Calculated Hours:", hours);

    return `${hours} hours`;
};


export const addScheduleService = async (schedule) => {
    try {
        const { StartTime, EndTime } = schedule;
        const duration = calculateDuration(StartTime, EndTime);
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, schedule.EmployeeID)
            .input('StartTime', sql.Time, schedule.StartTime)
            .input('EndTime', sql.Time, schedule.EndTime)
            .input('Duration', sql.VarChar(50), duration) // Add Duration to input
            .input('Days', sql.VarChar(255), schedule.Days)
            .query(`INSERT INTO Schedule (EmployeeID, StartTime, EndTime, Duration, Days) VALUES (@EmployeeID, @StartTime, @EndTime, @Duration, @Days)`);

        return result;
    } catch (error) {
        throw error;
    }
};
export const getScheduleByEmployeeIDService = async (EmployeeID) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, EmployeeID)
            .query("SELECT * FROM Schedule WHERE EmployeeID = @EmployeeID");
      
        return result.recordset[0]; // Return the first matching schedule record if found
    } catch (error) {
        throw error;
    }
};

export const updateScheduleService = async (ScheduleID, updatedScheduleData) => {
    try {
        const { StartTime, EndTime } = updatedScheduleData;
        const duration = calculateDuration(StartTime, EndTime);
        const result = await poolRequest()
            .input('ScheduleID', sql.Int, ScheduleID)
            .input('EmployeeID', sql.Int, updatedScheduleData.EmployeeID)
            .input('StartTime', sql.Time, updatedScheduleData.StartTime)
            .input('EndTime', sql.Time, updatedScheduleData.EndTime)
            .input('Duration', sql.VarChar(50), duration) // Add Duration to input
            .input('Days', sql.VarChar(255), updatedScheduleData.Days)
            .query("UPDATE Schedule SET EmployeeID = @EmployeeID, StartTime = @StartTime, EndTime = @EndTime, Duration = @Duration, Days = @Days WHERE ScheduleID = @ScheduleID");

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
