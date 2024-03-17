import { addAttendanceService, deleteAttendanceService, getAttendanceByIdService, getAttendanceByEmployeeService } from "../services/AttendanceService.js"; // Update import
import { checkIfValuesIsEmptyNullUndefined, orderData, paginate, sendCreated, sendNotFound, sendServerError} from "../helper/helperFunctions.js";
import { AttendanceValidator } from '../validators/AttendanceValidator.js'; // Update import
import { getEmployeeServices } from "../services/EmployeeServices.js";



export const getAttendance = async (req, res) => {
    // Implementation remains the same as it deals with getting employee data
try {
    const data =await getEmployeeServices();
    if (data.length ===0){
        sendNotFound(res, 'No Users found');
    }else{
        if(!req.query.page  || !req.query.limit){
            if(req.Query.order){

            }else{
                res.status(200).json(data);
            }
        }else{
            if(res.query.order){
                paginate(orderData(data, req.query.order), req,res);
            }else{
                paginate(data, req, res);
            }
        }
    }
} catch (error) {
    sendServerError(res, error);
    
}
};

export const createAttendance = async (req, res) => {
    try {
        const { EmployeeID, Date, TimeIn, TimeOut } = req.body;
        console.log(req.body);
        // Validate attendance data
        const { error } = AttendanceValidator({ EmployeeID, Date, TimeIn, TimeOut });
        console.log("error",error);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        
        // Add attendance record
        // const registeredAttendance =  { EmployeeID, Date, TimeIn, TimeOut  };
        const result = await addAttendanceService({ EmployeeID, Date, TimeIn, TimeOut });

        if (result) {
            sendCreated(res, 'Attendance created successfully');
        } else {
            sendServerError(res, "Error occurred while adding attendance record.");
        }

        // return res.status(201).json({ message: 'Attendance record created successfully' });
    } catch (error) {
        console.error("Error in createAttendance:", error);
        return res.status(500).send("Internal server error.");
    }
};

export const getAttendanceByEmployeeID = async (req, res) => {
    // Get attendance records by employee ID
    try {
        const EmployeeID = req.params.EmployeeID;
        const user = await getEmployeeByIdService(EmployeeID);
        
        if (user) {
            return res.status(200).json({ user });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ error: error.message });
    }
}



export const getAttendanceById = async (req, res) => {
    // Get attendance record by ID
};

export const updateAttendance = async (req, res) => {
    // Update attendance record
};

export const deleteAttendance = async (req, res) => {
    // Delete attendance record
};
