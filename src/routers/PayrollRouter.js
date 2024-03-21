import { Router } from 'express';
import { createPayroll, deletePayroll, getPayroll, getPayrollById, updatePayroll } from '../controller/PayrollController.js';


const PayrollRouter =Router();

PayrollRouter.post("/payroll",createPayroll);
PayrollRouter.get("/payroll",getPayroll);
PayrollRouter.put('/payroll/:PayrollID',updatePayroll);
PayrollRouter.get("/payroll/:PayrollID",getPayrollById);
PayrollRouter.delete("/payroll/:PayrollID",deletePayroll);

export default PayrollRouter;
