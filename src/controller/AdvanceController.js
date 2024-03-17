import { addAdvanceService, deleteAdvanceService, getAdvanceByIdService, updateAdvanceService } from "../services/AdvanceService.js";
import { sendBadRequest, sendNotFound, sendServerError, sendCreated, checkIfValuesIsEmptyNullUndefined } from "../helper/helperFunctions.js";
import { AdvanceValidator } from "../validators/AdvanceValidator.js";

export const createAdvance = async (req, res) => {
    try {
        const { EmployeeID, Date, Amount } = req.body;
console.log(req.body);
        // Validate advance data
        const { error } = AdvanceValidator({ EmployeeID, Date, Amount });
        if (error) {
            return sendBadRequest(res, error.details[0].message);
        }
        // Add advance
        const advance = await addAdvanceService({ EmployeeID, Date, Amount });
        return sendCreated(res, 'Advance created successfully');
    } catch (error) {
        return sendServerError(res, error.message);
    }
};

export const getAdvanceById = async (req, res) => {
    try {
        const { advanceId } = req.params;
        const advance = await getAdvanceByIdService(advanceId);

        if (!advance) {
            return sendNotFound(res, 'Advance not found');
        }

        return res.status(200).json(advance);
    } catch (error) {
        return sendServerError(res, error.message);
    }
};
export const updateAdvance = async (req, res) => {
    try {
        const { EmployeeID, Date, Amount } = req.body;
        const advanceId = req.params.advanceId;

        // Retrieve the advance cash record to update
        const advanceToUpdate = await getAdvanceByIdService(advanceId);

        // Check if the advance cash record exists
        if (!advanceToUpdate) {
            return sendNotFound(res, 'Advance not found');
        }

        // Check if any required fields are missing
        if (!checkIfValuesIsEmptyNullUndefined(req, res, req.body)) {
            return sendServerError(res, 'Please provide all required fields');
        }

        // Validate advance data
        const { error } = AdvanceValidator({ EmployeeID, Date, Amount });
        if (error) {
            return sendBadRequest(res, error.details[0].message);
        }

        // Update the advance cash record
        advanceToUpdate.EmployeeID = EmployeeID;
        advanceToUpdate.Date = Date;
        advanceToUpdate.Amount = Amount;

        await updateAdvanceService(advanceId, advanceToUpdate);

        return sendCreated(res, 'Advance updated successfully');
    } catch (error) {
        return sendServerError(res, error.message);
    }
};


export const deleteAdvance = async (req, res) => {
    try {
        const { advanceId } = req.params;
        const result = await deleteAdvanceService(advanceId);

        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: 'Advance deleted successfully' });
        } else {
            return sendNotFound(res, 'Advance not found');
        }
    } catch (error) {
        return sendServerError(res, error.message);
    }
};
