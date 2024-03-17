import joi from "joi";

export const AdvanceValidator = (advance) => {
    const AdvanceValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        Date: joi.date().required(),
        Amount: joi.number().precision(2).required(),
    });
    return AdvanceValidatorSchema.validate(advance);
}
