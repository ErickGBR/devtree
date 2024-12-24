import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';


// This function will check if there are any errors in the request body
export const handleInputError = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        next();
    }
}