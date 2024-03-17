import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import logger from './src/utils/logger.js';

import rateLimitMiddleware from './src/middleware/rateLimitMiddleware.js';
import EmployeeRouter from './src/routers/EmployeeRouter.js';
import AttendanceRouter from './src/routers/AttendanceRouter.js';
import OvertimeRouter from './src/routers/OvertimeRouter.js';
import AdvanceRouter from './src/routers/AdvanceRouter.js';
import ScheduleRouter from './src/routers/ScheduleRouter.js';
import PositionRouter from './src/routers/PositionRouter.js';
// import emailTemp from './emailTemp.js';




dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
rateLimitMiddleware(app);



app.use('/api', EmployeeRouter);
app.use('/api',AttendanceRouter);
app.use('/api',OvertimeRouter);
app.use('/api',AdvanceRouter);
app.use('/api',ScheduleRouter);
app.use('/api',PositionRouter);



app.listen(port, () => {
    logger.info(`server running on port http://localhost:${port}`);
})