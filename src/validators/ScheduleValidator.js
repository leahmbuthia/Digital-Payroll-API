import joi from "joi";

export const ScheduleValidator = (schedule) => {
    const ScheduleValidatorSchema = joi.object({
        StartTime: joi.string().required(), // Adjust the validation rules as per your requirements
        EndTime: joi.string().required(),
        Days: joi.string().required(),
        EmployeeID: joi.number().integer().required(), // Assuming EmployeeID is a number
    });
    return ScheduleValidatorSchema.validate(schedule);
}
