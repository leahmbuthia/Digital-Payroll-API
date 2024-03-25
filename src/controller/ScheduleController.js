import { addScheduleService, deleteScheduleService, getScheduleByEmployeeIDService, getScheduleByIDService, getScheduleService, updateScheduleService } from "../services/ScheduleServer.js"; // Update import
import { checkIfValuesIsEmptyNullUndefined, orderData, paginate, sendCreated, sendNotFound, sendServerError } from "../helper/helperFunctions.js";

export const getSchedule = async (req, res) => {
    try {
        const schedules = await getScheduleService();
        res.status(200).json({ schedules });
    } catch (error) {
        console.error("Error fetching all schedules:", error);
        sendServerError(res, error);
    }
};
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

// Controller to get schedule by EmployeeID
export const getScheduleByEmployeeID = async (req, res) => {
    try {
        const EmployeeID = req.params.EmployeeID;
        const schedule = await getScheduleByEmployeeIDService(EmployeeID); // Call the service function to fetch schedule details
        
        if (schedule) {
            return res.status(200).json({ schedule });
        } else {
            return res.status(404).json({ message: 'Schedule for EmployeeID not found' }); // Return a 404 status if schedule is not found
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Return a 500 status for any internal server error
    }
};
export const createSchedule = async (req, res) => {
    try {
        const { EmployeeID, StartTime, EndTime, Days } = req.body;
        const duration = calculateDuration(StartTime, EndTime);
        const newSchedule = { EmployeeID, StartTime, EndTime, Duration: duration, Days };
        const result = await addScheduleService(newSchedule);
        if (result.message) {
            sendServerError(res, result.message);
        } else {
            res.status(201).json({ message: 'Schedule Created Successfully' });
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
};
export const getScheduleById = async (req, res) => {
    try {
        const scheduleID = req.params.scheduleID;
        const schedule = await getScheduleByIDService(scheduleID);
        if (schedule) {
            res.status(200).json({ schedule });
        } else {
            sendNotFound(res, 'Schedule not found');
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
};

export const updateSchedule = async (req, res) => {
    try {
        const {ScheduleID} = req.params;
        const updatedScheduleData = req.body;
        const existingSchedule = await getScheduleByIDService(ScheduleID);
        if (!existingSchedule) {
            return res.status(400).json({ message: "Schedule not found" });
        }
        const result = await updateScheduleService(ScheduleID, updatedScheduleData);
        if (result instanceof Error) {
            console.error("Error Updating Schedule:", result);
            return res.status(500).json({ message: 'Schedule update failed' });
        } else {
            return res.status(200).json({ message: 'Schedule updated successfully' });
        }
    } catch (error) {
        // console.error("Error updating schedule:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const ScheduleID = req.params.ScheduleID;
        const result = await deleteScheduleService(ScheduleID);
        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: 'Schedule Deleted Successfully' });
        } else {
            return res.status(404).json({ error: 'Schedule not found' });
        }
    } catch (error) {
        // console.error("Error deleting schedule:", error);
        // return res.status(500).json({ message: 'Internal server error' });
    }
};
