import Joi from "joi";

export const PayrollValidator = (payroll) => {
    const PayrollValidatorSchema = Joi.object({
        EmployeeID: Joi.number().integer().required(),
        GrossPay: Joi.number().precision(2).required(),
        // Deductions: Joi.number().precision(2).required(),
        // NetPay: Joi.number().precision(2).required(),
        PayrollDate: Joi.date().iso().required()
    });

    return PayrollValidatorSchema.validate(payroll);
};
