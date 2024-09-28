import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { HttpCode } from "../../core/constants";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const validator = {
    validateUser: [
        // Validation of user name
        body('name')
            .exists().withMessage('Le nom est requis !')
            .trim().notEmpty().withMessage('le nom ne doit pas etre vide !')
            .isString().withMessage('le nom doit etre une chaine de caractere !')
            .isLength({min:3}).withMessage('le nom est trop court !')
            .isLength({max: 50}).withMessage('le nom est trop long !')
        ,
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .trim().notEmpty().withMessage('l\'email ne doit pas etre vide !')
            .isEmail().withMessage('Addresse email vailde !')
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
            .isLength({min:3}).withMessage('le nom est trop court !')
            .isLength({max: 50}).withMessage('le nom est trop long !')
        ,
        // Validatoion of user email
        body('email')
            .optional()
            .exists().withMessage('L\'email est requis !')
            .trim().notEmpty().withMessage('l\'email ne doit pas etre vide !')
            .isEmail().withMessage('Addresse email vailde !')
        ,
        // validation of user password
        body('password')
            .optional()
            .exists().withMessage('Le mot de passe est requis !')
            .trim().notEmpty().withMessage('mot de passe ne peut etre vide!')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,
    ],
    
    validateUserAtLogin: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .trim().notEmpty().withMessage('l\'email ne doit pas etre vide !')
            .isEmail().withMessage('Addresse email vailde !')
        ,
    ],

    validateUserID: [
        // validation de l'identifiant
        param('userID')
            .exists().withMessage('L\'ID de l\'utilisateur est requis !')
            .isMongoId().withMessage('Format de l\'ID invalide !')
        ,
    ],

    validateBlog: [
        body('title')
            .exists().withMessage('title is required !')
            .isLength({min:3}).withMessage('le titre n\'est pas assez long !')
            .isLength({max: 100}).withMessage('le titre est trop long !')
            .isString().withMessage('title should be a number !')
        ,
        body('content')
            .exists().withMessage('content is required !')
            .isLength({min:3}).withMessage('le contenu n\'est pas assez long !')
            .isString().withMessage('content should be a number !')
        ,
        body('number')
            .exists().withMessage('number is required !')
            .isInt().withMessage('number should be a number !')
        ,
    ],

    validateIDOfParams: [
        param('tableID')
            .exists().withMessage('tableID is required in params !')
            .isMongoId().withMessage("table ID passed in params should be a valid format !")
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
