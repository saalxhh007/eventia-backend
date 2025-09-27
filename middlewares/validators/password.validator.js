import { body } from "express-validator";

export const passwordValidation = [
    body('data.newPassword')
        .isLength({ min: 8 }).withMessage('New Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('New Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('New Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('New Password must contain at least one special character'),
]