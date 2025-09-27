import { body } from "express-validator";

export const signupValidation = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Full Name is required')
        .isLength({ min: 8 }).withMessage('Full Name must be at least 8 characters long'),
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format'),
    body('phone')
            .trim()
            .notEmpty().withMessage('Phone number is required')
            .isMobilePhone('any').withMessage('Invalid phone number format'),
    body('date_of_birth')
            .trim()
            .notEmpty().withMessage('date of birth is required'),
    body('address')
            .trim()
            .notEmpty().withMessage('address is required'),
    body('state')
            .trim()
            .notEmpty().withMessage('state is required'),
    body('district')
            .trim()
            .notEmpty().withMessage('district is required'),
    body('municipality')
            .trim()
            .notEmpty().withMessage('municipality is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),    
]