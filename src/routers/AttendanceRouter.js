import { Router } from "express";
import { createAttendance, deleteAttendance, getAttendance, getAttendanceById, updateAttendance } from "../controller/AttendanceController.js";

const AttendanceRouter =Router();

AttendanceRouter.get("/attendances", getAttendance);
AttendanceRouter.post("/attendance",createAttendance);
AttendanceRouter.put('/attendance/:AttendanceID', updateAttendance);
AttendanceRouter.get('/attendance/single/:AttendanceID', getAttendanceById);
AttendanceRouter.delete('/attendance/:AttendanceID', deleteAttendance);



export default AttendanceRouter;