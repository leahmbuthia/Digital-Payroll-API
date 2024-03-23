import { Router } from "express";
import { getDeductions, createDeduction, updateDeduction, getDeductionById, deleteDeduction } from "../controller/DeductionController.js";

const deductionRouter = Router();

deductionRouter.get("/deductions", getDeductions);
deductionRouter.post("/deductions", createDeduction);
deductionRouter.put('/deductions/:DeductionID', updateDeduction);
deductionRouter.get('/deductions/:DeductionID', getDeductionById);
deductionRouter.delete('/deductions/:DeductionID', deleteDeduction);

export default deductionRouter;