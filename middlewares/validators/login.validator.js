import { body } from "express-validator";

export const loginValidation = [
    body('Data.email')
        .trim()
        .isEmail().withMessage('Invalid email format'),
    
    body('Data.password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
]