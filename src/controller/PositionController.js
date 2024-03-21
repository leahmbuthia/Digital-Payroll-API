import { getPositionByIdService, addPositionService, updatePositionService, deletePositionService } from "../services/PositionService.js";
import { sendBadRequest, sendCreated, sendNotFound, sendServerError } from "../helper/helperFunctions.js";
import { PositionValidator } from "../validators/PositionValidator.js";
import logger from "../utils/logger.js";
import { getAllPositionsService } from "../services/PositionService.js";


export const getPositions = async (req, res) => {
    try {
        const results = await getAllPositionsService();
        const position = results.recordset
        res.status(200).json({position: position}); // Assuming you have a service function to fetch all positions
        
    } catch (error) {
        console.error("Error fetching all Overtime:", error)
        sendServerError(res, error);
    }
}


export const getPositionById = async (req, res) => {
    try {
        const positionID = req.params.positionID;
        const position = await getPositionByIdService(positionID);
        
        if (position) {
            return res.status(200).json({ position });
        } else {
            return sendNotFound(res, 'Position not found');
        }
    } catch (error) {
        return sendServerError(res, error.message);
    }
}

export const createPosition = async (req, res) => {
    try {
        const { EmployeeID, Position } = req.body;
        
        const { error } = PositionValidator({ EmployeeID, Position });
        if (error) {
            return sendBadRequest(res, error.details[0].message);
        } else {
            const result = await addPositionService(EmployeeID, Position);
            
            if (result.message) {
                return sendServerError(res, result.message);
            } else {
                return sendCreated(res, 'Position created successfully');
            }
        }
    } catch (error) {
        return sendServerError(res, error.message);
    }
}

export const updatePosition = async (req, res) => {
    try {
        const positionID = req.params.positionID;
        const { Position } = req.body;
        
        const result = await updatePositionService(positionID, Position);
        
        if (result.message) {
            return sendServerError(res, result.message);
        } else {
            return sendCreated(res, 'Position updated successfully');
        }
    } catch (error) {
        return sendServerError(res, error.message);
    }
}

export const deletePosition = async (req, res) => {
    try {
        const positionID = req.params.positionID;
        const result = await deletePositionService(positionID);

        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: 'Position deleted successfully' });
        } else {
            return sendNotFound(res, 'Position not found');
        }
    } catch (error) {
        return sendServerError(res, error.message);
    }
}
