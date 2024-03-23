import joi from "joi";

export const DeductionValidator = (deduction) => {
    const DeductionValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        NHIF: joi.number().required(),
        NSSF: joi.number().required(),
        PAYE: joi.number().required(),
        TotalDeductions: joi.number().required()
    });
    return DeductionValidatorSchema.validate(deduction);
}
