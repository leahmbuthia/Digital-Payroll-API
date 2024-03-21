import joi from "joi";

export const OvertimeValidator = (overtime) => {
    const OvertimeValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        Hours: joi.number().integer().required(),
        Minutes: joi.number().integer().required(),
        Rate: joi.number().precision(2).required()
    });

    return OvertimeValidatorSchema.validate(overtime);
}
