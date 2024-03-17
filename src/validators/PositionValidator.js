import joi from "joi";

export const PositionValidator = (position) => {
    const PositionValidatorSchema = joi.object({
        EmployeeID: joi.number().integer().required(),
        Position: joi.string().required()
    });
    return PositionValidatorSchema.validate(position);
}
