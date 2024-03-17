import joi from "joi";

export const OvertimeValidator = (overtime) => {
    const OvertimeValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        Date: joi.date().required(),
        Hours: joi.number().integer().min(0).required(),
        Minutes: joi.number().integer().min(0).max(59).required(),
        Rate: joi.number().precision(2).required(),
    });
    return OvertimeValidatorSchema.validate(overtime);
};
