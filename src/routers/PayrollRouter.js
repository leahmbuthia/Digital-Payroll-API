import { Router } from 'express';
import { createPayroll, deletePayroll, getPayroll, getPayrollById, updatePayroll } from '../controller/PayrollController.js';


const PayrollRouter =Router();

PayrollRouter.post("/payrolls",createPayroll);
PayrollRouter.get("/payrolls",getPayroll);
PayrollRouter.put('/payrolls/:PayrollID',updatePayroll);
PayrollRouter.get("/payrolls/:PayrollID",getPayrollById);
PayrollRouter.delete("/payrolls/:PayrollID",deletePayroll);

export default PayrollRouter;
