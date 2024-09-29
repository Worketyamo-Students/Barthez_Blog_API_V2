import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { HttpCode } from "../../core/constants";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const validator = {
    validateUser: [
        // Validation of user name
        body('name')
            .exists().withMessage('Le nom est requis !')
            .trim().notEmpty().withMessage('le nom ne doit pas etre vide !')
            .isString().withMessage('le nom doit etre une chaine de caractere !')
            .isLength({ min: 3 }).withMessage('le nom est trop court !')
            .isLength({ max: 50 }).withMessage('le nom est trop long !')
        ,
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .trim().notEmpty().withMessage('l\'email ne doit pas etre vide !')
            .isEmail().withMessage('Addresse email invailde !')
        ,
        // validation of user password
        body('password')
            .exists().withMessage('Le mot de passe est requis !')
            .trim().notEmpty().withMessage('mot de passe ne peut etre vide!')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,
    ],

    validateUserUpdate: [
        // Validation of user name
        body('name')
            .optional()
            .isString().withMessage('le nom doit etre une chaine de caractere !')
            .isLength({ min: 3 }).withMessage('le nom est trop court !')
            .isLength({ max: 50 }).withMessage('le nom est trop long !')
        ,
        // Validatoion of user email
        body('email')
            .optional()
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
        ,
    ],
    validatenewPWD: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
        ,

        // validation of user password
        body('newpassword')
            .optional()
            .exists().withMessage('Le mot de passe est requis !')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,
    ],

    validatePWDs: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
        ,

        // validation of user password
        body('oldPassword')
            .optional()
            .exists().withMessage('Le mot de passe est requis !')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,

        // validation of user password
        body('newpassword')
            .optional()
            .exists().withMessage('Le mot de passe est requis !')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,

    ],

    validateEmail: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
        ,
    ],

    validateOTP: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
        ,

        // Validation de l'otp
        body("otp")
            .exists().withMessage("Code OTP requis")
            .isLength({ min: 6, max: 6 }).withMessage("le code otp doit avoir 6 caracteres")
    ],

    validateBlog: [
        body('title')
            .exists().withMessage('title is required !')
            .isLength({ min: 3 }).withMessage('le titre n\'est pas assez long !')
            .isLength({ max: 100 }).withMessage('le titre est trop long !')
            .isString().withMessage('title should be a number !')
        ,
        body('content')
            .exists().withMessage('content is required !')
            .isLength({ min: 3 }).withMessage('le contenu n\'est pas assez long !')
            .isString().withMessage('content should be a number !')
        ,
    ],
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res
            .status(HttpCode.UNPROCESSABLE_ENTITY)
            .json(
                {
                    errors: errors.array()
                }
            )
    }
    next();
}
