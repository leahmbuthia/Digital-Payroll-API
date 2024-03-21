import joi from "joi";



export const EmployeeValidator = (Employee) => {
    const EmployeeValidatorSchema = joi.object({
       
        FirstName: joi.string().required(),
        LastName: joi.string().required(),
        Address: joi.string().required(),
        DOB: joi.date().required(), // Corrected date validation syntax
        Email: joi.string().email().required(),
        PhoneNo: joi.string().required(),
        Gender: joi.string().required(),
        Position: joi.string().required(),
        Password: joi.string().required(),
        Schedule: joi.string().required(),
        // PhotoURL: joi.string().required(),
        Role:joi.string().required(),
    });
    return EmployeeValidatorSchema.validate(Employee);
}
export const EmployeeLoginValidator = (employee) => {
    const EmployeeLoginValidatorSchema = joi.object({
        Email: joi.string().email().required(),
        Password: joi.string().min(4).required(),
    });
    return EmployeeLoginValidatorSchema.validate(employee);
}


