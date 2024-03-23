import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import logger from './src/utils/logger.js';
import cors from 'cors'; // Import cors module
import multer from 'multer';
import path from 'path';

import rateLimitMiddleware from './src/middleware/rateLimitMiddleware.js';
import EmployeeRouter from './src/routers/EmployeeRouter.js';
import AttendanceRouter from './src/routers/AttendanceRouter.js';
import OvertimeRouter from './src/routers/OvertimeRouter.js';
import AdvanceRouter from './src/routers/AdvanceRouter.js';
import ScheduleRouter from './src/routers/ScheduleRouter.js';
import PositionRouter from './src/routers/PositionRouter.js';
import PayrollRouter from './src/routers/PayrollRouter.js'
import DeductionRouter from './src/routers/DeductionRouter.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
// app.use(cookieParser())
// app.use(session({
//     secret: 'secret',
//     resave :false,
//     saveUnitialized: false,
//     cookie:{
//         secure:false,
//         maxAge: 1000 * 60 * 60* 24
//     }
// }))
//middlewares
const storage =multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/images')
    },
    filename: (req, file, cb) =>{
        cb(null, file.filename + ""+Date.now() + path.extname(file.originalname))
    }
})
const upload =multer({
    storage:storage
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
rateLimitMiddleware(app);

app.use('/api', EmployeeRouter);
app.use('/api',AttendanceRouter);
app.use('/api',OvertimeRouter);
app.use('/api',AdvanceRouter);
app.use('/api',ScheduleRouter);
app.use('/api',PositionRouter);
app.use('/api',PayrollRouter)
app.use('/api',DeductionRouter)
app.post('/upload',upload.single('image'), (req,res)=>{
console.log(req.file);
})

app.listen(port, () => {
    logger.info(`server running on port http://localhost:${port}`);
});
