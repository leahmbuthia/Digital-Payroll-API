import { addOvertimeService, deleteOvertimeService, getOvertimeByIDService, getOvertimeService, updateOvertimeService } from "../services/OvertimeService.js";
import { checkIfValuesIsEmptyNullUndefined, orderData, paginate, sendCreated, sendNotFound, sendServerError } from "../helper/helperFunctions.js";
import { OvertimeValidator } from '../validators/OvertimeValidator.js';
import { getEmployeeServices } from "../services/EmployeeServices.js";

export const getOvertime = async (req, res) => {
    try {
        const overtimeList = await getOvertimeService();
        res.status(200).json({ overtime: overtimeList });
    } catch (error) {
        console.error("Error fetching all Overtime");
        sendServerError(res, error);
    }
}

export const createOvertime = async (req, res) => {
    try {
        const { EmployeeID,  Hours, Minutes, Rate } = req.body;
        const { error } = OvertimeValidator({ EmployeeID, Hours, Minutes, Rate });

        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const CreatedDate = new Date();
            const newOvertime = { EmployeeID,CreatedDate, Hours, Minutes, Rate };
            const result = await addOvertimeService(newOvertime);
            if (result.message) {
                sendServerError(res, result.message);
            } else {
                res.status(201).json({ message: 'Overtime Created Successfully' });
                console.log('Request Body:', req.body);
            }
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
};

export const getOvertimeById = async (req, res) => {
    try {
        const OvertimeID = req.params.OvertimeID;
        const overtime = await getOvertimeByIDService(OvertimeID);

        if (overtime) {
            return res.status(200).json({ overtime });
        } else {
            return sendNotFound(res, 'Overtime not found');
        }
    } catch (error) {
        return sendServerError(res, error.message)
    }
};

export const updateOvertime = async (req, res) => {
    try {
        const { OvertimeID } = req.params;
        const updatedOvertimeData = req.body;
        const existingOvertime = await getOvertimeByIDService(OvertimeID);

        if (!existingOvertime) {
            return res.status(400).json({ message: "Overtime not found" });
        }

        const result = await updateOvertimeService(OvertimeID, updatedOvertimeData);

        if (result instanceof Error) {
            console.error("Error Updating Overtime:", result);
            return res.status(500).json({ message: 'Overtime update failed' });
        } else {
            return res.status(200).json({ message: 'Overtime updated successfully' });
        }
    } catch (error) {
        console.error("Error updating overtime:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteOvertime = async (req, res) => {
    try {
        const OvertimeID = req.params.OvertimeID;
        const result = await deleteOvertimeService(OvertimeID);

        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: 'Overtime Deleted Successfully' });
        } else {
            return res.status(404).json({ error: 'Overtime record not found' });
        }
    } catch (error) {
        console.error("Error deleting overtime:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
