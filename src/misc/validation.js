/**
 * @fileOverview it contains all the functions needed to validate the users data
 * @author brian omondi
 * @version 0.0.1
 */

//validation
import Joi from "@hapi/joi";

/**validate registration data */
export function registrationValidation(data) {
  //create a Joi validation object
  const UserValidationSchema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),

    email: Joi.string()
      .email()
      .required()
  });

  return UserValidationSchema.validate(data);
}
/**validate login data */
export function loginValidation(data) {
  const UserValidationSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
  });

  return UserValidationSchema.validate(data);
}
