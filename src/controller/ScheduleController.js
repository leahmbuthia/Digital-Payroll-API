import { addScheduleService, deleteScheduleService, getScheduleByIdService, getScheduleServices, updateScheduleService } from "../services/ScheduleServer.js";
import { checkIfValuesIsEmptyNullUndefined, orderData, paginate, sendCreated, sendNotFound } from "../helper/helperFunctions.js";
import { sendServerError } from '../helper/helperFunctions.js';
import { ScheduleValidator } from '../validators/ScheduleValidator.js'; // Assuming you have a validator for schedules
import { getAttendanceByEmployeeService } from '../services/AttendanceService.js';

export const loginEmployee = async (req, res) => {
    // Implementation remains the same or you can remove it if not needed for schedules
};

export const getSchedule = async (req, res) => {
    try {
        const data = await getScheduleServices();
        if (data.length === 0) {
            sendNotFound(res, 'No schedules found');
        } else {
            if (!req.query.page || !req.query.limit) {
                if (req.query.order) {
                    res.status(200).json(orderData(data, req.query.order));
                } else {
                    res.status(200).json(data);
                }
            } else {
                if (req.query.order) {
                    paginate(orderData(data, req.query.order), req, res);
                } else {
                    paginate(data, req, res);
                }
            }
        }
    } catch (error) {
        sendServerError(res, error);
    }
};

export const createSchedule = async (req, res) => {
    try {
        const { EmployeeID, StartTime, EndTime, Days } = req.body;

        const existingSchedule = await getScheduleByIdService(EmployeeID);
        if (existingSchedule) {
            return res.status(400).send("Schedule already exists for the employee");
        } else {
            const { error } = ScheduleValidator({ EmployeeID, StartTime, EndTime, Days });
            if (error) {
                return res.status(400).send(error.details[0].message);
            } else {
                const result = await addScheduleService({ EmployeeID, StartTime, EndTime, Days });
                if (result.message) {
                    sendServerError(res, result.message)
                } else {
                    // Send mail or any other relevant action
                    sendCreated(res, 'Schedule created successfully');
                }
            }
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
};


export const updateSchedule = async (req, res) => {
    try {
        const { StartTime, EndTime, Days } = req.body;
        const scheduleID = req.params.scheduleID;
        const scheduleToUpdate = await getScheduleByIdService(scheduleID);
        if (!scheduleToUpdate) {
            sendNotFound(res, 'Schedule not found');
        } else {
            if (checkIfValuesIsEmptyNullUndefined(req, res, req.body)) {
                if (StartTime) {
                    scheduleToUpdate.StartTime = StartTime;
                }
                if (EndTime) {
                    scheduleToUpdate.EndTime = EndTime;
                }
                if (Days) {
                    scheduleToUpdate.Days = Days;
                }
                await updateScheduleService(scheduleToUpdate);
                sendCreated(res, 'Schedule updated successfully');
            } else {
                sendServerError(res, 'Please provide all required fields');
            }
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const scheduleID = req.params.scheduleID;
        const result = await deleteScheduleService(scheduleID);
        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: 'Schedule deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Schedule not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
