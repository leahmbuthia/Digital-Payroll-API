import { Router } from 'express';
import { createSchedule, deleteSchedule, getSchedule, getScheduleById, updateSchedule } from "../controller/ScheduleController.js";
import { authMiddleware } from '../middleware/AuthUserMiddleware.js';

const ScheduleRouter = Router();

// ScheduleRouter.post("/schedule/auth/login", loginSchedule); // You may or may not need this depending on your application's requirements
ScheduleRouter.get('/schedule', getSchedule);
ScheduleRouter.post('/schedule', createSchedule);
ScheduleRouter.put('/schedule/:scheduleID', updateSchedule);
ScheduleRouter.get('/schedule/:scheduleID', getScheduleById);
ScheduleRouter.delete('/schedule/:scheduleID', deleteSchedule);

export default ScheduleRouter;
