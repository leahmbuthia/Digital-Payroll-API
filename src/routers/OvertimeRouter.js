import { Router } from 'express';
import { createOvertime, deleteOvertime, getOvertime, updateOvertime } from "../controller/OvertimeController.js";
import { authMiddleware } from '../middleware/AuthUserMiddleware.js';

const OvertimeRouter = Router();

OvertimeRouter.post("/overtime", createOvertime);
OvertimeRouter.get('/overtime', getOvertime);
OvertimeRouter.put('/overtime/:OvertimeID', updateOvertime);
// OvertimeRouter.get('/overtime/:OvertimeID', getOvertimeById);
OvertimeRouter.delete('/overtime/:OvertimeID', deleteOvertime);

export default OvertimeRouter;
