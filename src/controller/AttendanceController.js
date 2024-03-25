import { addAttendanceService, deleteAttendanceService, findAttendanceByEmployeeIDAndDate, getAttendanceByIDService, getAttendanceByIdService,getAttendanceService, updateAttendanceService } from "../services/AttendanceService.js"; // Update import
import { checkIfValuesIsEmptyNullUndefined, orderData, paginate, sendCreated, sendNotFound, sendServerError} from "../helper/helperFunctions.js";
import { AttendanceValidator } from '../validators/AttendanceValidator.js'; // Update import
import { getEmployeeServices } from "../services/EmployeeServices.js";



export const getAttendance = async (req, res) => {
    try{
        const results = await getAttendanceService();
        const attendance =results.recordset
        res.status(200).json({attendance:attendance})
    }catch(error){
        console.error("Error fetching all Attendance");
        sendServerError(res,error)
    }

}
export const createAttendance = async (req, res) => {
    try {
        const { EmployeeID, TimeIn, TimeOut } = req.body;
        const { error } = AttendanceValidator({ EmployeeID, TimeIn, TimeOut });

        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            // Check if attendance already exists for the employee on the current day
            const existingAttendance = await findAttendanceByEmployeeIDAndDate(EmployeeID, new Date());
            
            if (existingAttendance) {
                return res.status(400).json({ message: 'Attendance already recorded for today' });
            }

            // If attendance does not exist, proceed to create a new record
            const CreatedDate = new Date();
            const newAttendance = { EmployeeID, CreatedDate, TimeIn, TimeOut };
            const result = await addAttendanceService(newAttendance);
            
            // Extract the AttendanceID from the result
            const { AttendanceID } = result;

            if (AttendanceID) {
                // Include the AttendanceID in the response
                res.status(201).json({ message: 'Attendance Created Successfully', AttendanceID });
            } else {
                // Handle the case where AttendanceID is missing from the result
                return res.status(500).json({ message: 'Error creating attendance. AttendanceID not found in response.' });
            }
        }
    } catch (error) {
        sendServerError(res, error.message);
    }
};



// export const getAttendanceByEmployeeID = async (req, res) => {
//     // Get attendance records by employee ID
//     try {
//         const EmployeeID = req.params.EmployeeID;
//         const user = await getAttendanceById(EmployeeID);
        
//         if (user) {
//             return res.status(200).json({ user });
//         } else {
//             return res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         // Handle any unexpected errors
//         return res.status(500).json({ error: error.message });
//     }
// }



export const getAttendanceById = async (req, res) => {
    try {
        const AttendanceID = req.params.AttendanceID;
        const attendance = await getAttendanceByIDService(AttendanceID);

        if (attendance){
            return res.status(200).json({attendance});
        }else{
            return sendNotFound(res, 'Attendance not found');
        }
    } catch (error) {
        return sendServerError(res, error.message)
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const {AttendanceID} =req.params;
        const updatedAttendanceData = req.body;
        const existingAttendance = await getAttendanceByIDService(AttendanceID);
     
        if (!existingAttendance){
            return res.status(404).json({
                message: "Attendance Not  found"
            });
        }
        //update 
        const result = await updateAttendanceService(AttendanceID, updatedAttendanceData);

         if (result instanceof Error){
            console.error("Error Updating Attendance:", result);
            return res.status(500).json({
                message: 'Attendance updated successfully'
            });
         }else{
            return res.status(200).json({
                message: 'ClockedOut sucessfully '
            });
         }
        
    } catch (error) {
        // console.error("Error updating employee:", error);
    return res.status(500).json({
      message: 'Internal server error'
    });
        
    }
};

export const deleteAttendance = async (req, res) => {
  try {
    const AttendanceID = req.params.AttendanceID;
    const result = await deleteAttendanceService(AttendanceID);

    if(result.rowsAffected[0] > 0){
        return res.status(200).json({message: 'Attendance Deleted Successfully'});
    }else{
        return res.status(404).json({error: error.message});
    }
  } catch (error) {
    
  }
};
