import { Router } from "express";
import { deleteAttendance, getAttendance, getAttendanceByEmployeeID, updateAttendance } from "../controller/AttendanceController.js";

const AttendanceRouter =Router();

AttendanceRouter.get("/attendance", getAttendance);
AttendanceRouter.post("/attendance", getAttendance);
AttendanceRouter.put('/attendance/:AttendanceID', updateAttendance);
AttendanceRouter.get('/attendance/:AttendanceID', getAttendanceByEmployeeID);
AttendanceRouter.put('/attendance/:AttendanceID', deleteAttendance);



export default AttendanceRouter;