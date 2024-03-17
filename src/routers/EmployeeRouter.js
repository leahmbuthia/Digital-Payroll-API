import { Router } from 'express';
import { createEmployee,deleteEmployee,getByEmployeeById,getEmployee,loginEmployee, updateEmployee} from "../controller/EmployeeController.js";
import { authMiddleware } from '../middleware/AuthUserMiddleware.js';
const EmployeeRouter = Router();


EmployeeRouter.post("/employee/auth/login", loginEmployee);
EmployeeRouter.get('/employee', getEmployee);
EmployeeRouter.post('/employee',createEmployee);
// EmployeeRouter.put('/employee/:EmployeeID',authMiddleware, updateEmployee);
// EmployeeRouter.get('/employee/:EmployeeID',authMiddleware, getEmployeeById);
// EmployeeRouter.delete('/employee/:EmployeeID', authMiddleware,deleteEmployee);
EmployeeRouter.put('/employee/:EmployeeID', updateEmployee);
EmployeeRouter.get('/employee/:EmployeeID',  getByEmployeeById);
EmployeeRouter.delete('/employee/:EmployeeID',deleteEmployee);



export default EmployeeRouter;