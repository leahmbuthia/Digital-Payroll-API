import { sendCreated, sendServerError } from "../helper/helperFunctions.js";
import { addOvertimeService, getOvertimeByIdService, updateOvertimeService, deleteOvertimeService } from "../services/OvertimeService.js"; // Import Overtime services instead of Employee services
import { OvertimeValidator } from '../validators/OvertimeValidator.js'; // Import OvertimeValidator instead of EmployeeValidator


export const getOvertime = async (req, res) => {
    try {
        const data = await getOvertimeServices();
        if (data.length === 0) {
            sendNotFound(res, 'No Overtime entries found');
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

export const createOvertime = async (req, res) => {
    try {
        const { EmployeeID, Date, Hours, Minutes, Rate } = req.body;

        // Validate input data
        const { error } = OvertimeValidator({ EmployeeID, Date, Hours, Minutes, Rate });
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Check if overtime for the given employee and date already exists
        // Add your logic here if needed

        // Create new overtime entry
        const result = await addOvertimeService({ EmployeeID, Date, Hours, Minutes, Rate });
        if (result.message) {
            return sendServerError(res, result.message);
        }

        // If successfully created, send response
        return sendCreated(res, 'Overtime entry created successfully');
    } catch (error) {
        return sendServerError(res, error.message);
    }
};

export const updateOvertime = async (req, res) => {
    try {
        const { Date, Hours, Minutes, Rate } = req.body;
        const OvertimeID = req.params.OvertimeID;

        // Validate input data
        const { error } = OvertimeValidator({ Date, Hours, Minutes, Rate });
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Check if the overtime entry exists
        const overtimeToUpdate = await getOvertimeByIdService(OvertimeID);
        if (!overtimeToUpdate) {
            return sendNotFound(res, 'Overtime entry not found');
        }

        // Update overtime entry
        await updateOvertimeService({ OvertimeID, Date, Hours, Minutes, Rate });

        return sendCreated(res, 'Overtime entry updated successfully');
    } catch (error) {
        return sendServerError(res, error.message);
    }
};

export const deleteOvertime = async (req, res) => {
    try {
        const OvertimeID = req.params.OvertimeID;

        // Check if the overtime entry exists
        const result = await deleteOvertimeService(OvertimeID);

        // Check if any rows are affected (overtime entry deleted)
        if (result.rowsAffected[0] > 0) {
            // Return a success message
            return res.status(200).json({ message: 'Overtime entry deleted successfully' });
        } else {
            // If no overtime entry is deleted, return an error
            return sendNotFound(res, 'Overtime entry not found');
        }
    } catch (error) {
        // Handle any unexpected errors
        return sendServerError(res, error.message);
    }
};