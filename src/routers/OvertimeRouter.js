import { Router } from 'express';
import { createOvertime, deleteOvertime, getOvertime, getOvertimeById, updateOvertime } from "../controller/OvertimeController.js"; // Updated import statements
// import { authMiddleware } from '../middleware/AuthUserMiddleware.js';

const OvertimeRouter = Router(); // Changed the router name to OvertimeRouter

OvertimeRouter.post("/overtime", createOvertime); // Changed the route to /overtime
OvertimeRouter.get('/overtime', getOvertime); // Changed the route to /overtime
OvertimeRouter.put('/overtime/:OvertimeID', updateOvertime); // Changed the route to /overtime/:OvertimeID
OvertimeRouter.get('/overtime/:OvertimeID', getOvertimeById); // Changed the route to /overtime/:OvertimeID
OvertimeRouter.delete('/overtime/:OvertimeID', deleteOvertime); // Changed the route to /overtime/:OvertimeID

export default OvertimeRouter;


