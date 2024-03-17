import joi from "joi";

export const AttendanceValidator = (attendance) => {
    const AttendanceValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        Date: joi.date().required(),
        TimeIn: joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        TimeOut: joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    });
    return AttendanceValidatorSchema.validate(attendance);
};