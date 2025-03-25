import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^\+[\d\s\-()]{7,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must start with '+' and can contain min 7 digits",
      "any.required": "Phone number is required",
    }),
  first_name: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must be less than 50 characters",
    "any.required": "First name is required",
  }),
  last_name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must be less than 50 characters",
    "any.required": "Last name is required",
  }),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*+?&])[A-Za-z\d@$!%*+?&]+$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be no longer than 50 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*+?&)",
      "any.required": "Password is required",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
