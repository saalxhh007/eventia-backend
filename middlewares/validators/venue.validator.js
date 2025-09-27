import { body } from "express-validator";

export const venuesValidation = [
    body('Data.name')
        .trim()
        .notEmpty().withMessage('Venue Name is required'),
    body('Data.category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['wedding', 'party', 'conference', 'exhibition', 'sports', 'cultural'])
        .withMessage(
            'Category must be one of the following: wedding, party, conference, exhibition, sports, cultural'
        ),
    body('Data.address')
        .trim()
        .notEmpty().withMessage('address is required'),
    body('Data.state')
        .trim()
        .notEmpty().withMessage('state is required'),
    body('Data.district')
        .trim()
        .notEmpty().withMessage('district is required'),
    body('Data.municipality')
        .trim()
        .notEmpty().withMessage('municipality is required'),
    body('Data.capacity')
        .trim()
        .notEmpty()
        .isInt({ gt: 0 }).withMessage('Capacity must be a positive integer'),
    body('Data.price')
        .trim()
        .notEmpty().withMessage('Price is required')
        .isInt({ gt: 0 }).withMessage('Price must be a positive integer'),
]