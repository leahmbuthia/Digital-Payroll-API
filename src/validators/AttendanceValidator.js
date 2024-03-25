import joi from "joi";

export const AttendanceValidator = (attendance) => {
    const AttendanceValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        TimeIn: joi.string().isoDate().required(),
        TimeOut: joi.string().isoDate(), 
    });

    return AttendanceValidatorSchema.validate(attendance);

}