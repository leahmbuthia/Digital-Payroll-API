import { Router } from "express";
import { createAttendance, deleteAttendance, getAttendance, getAttendanceById, updateAttendance } from "../controller/AttendanceController.js";

const AttendanceRouter =Router();

AttendanceRouter.get("/attendance", getAttendance);
AttendanceRouter.post("/attendance",createAttendance);
AttendanceRouter.put('/attendance/:AttendanceID', updateAttendance);
AttendanceRouter.get('/attendance/:AttendanceID', getAttendanceById);
AttendanceRouter.delete('/attendance/:AttendanceID', deleteAttendance);



export default AttendanceRouter;