import { Router } from "express";
import usersControllers from "../controllers/users-controllers";
import { validate, validator } from "../services/validator/validator";
import ROUTES from "../utils/mocks/mocks-routes";
import upload from "../middleware/upload-file";
import authUser from "../middleware/authUser";

const user: Router = Router();

//? Inscription of new user
user.post(
    ROUTES.USER.INSCRIPTION, 
    validator.validateUser, 
    validate, 
    upload.single('image'),
    usersControllers.inscription
);

//? Connexion of user
user.post(
    ROUTES.USER.CONNEXION, 
    validator.validateEmail, 
    validate, 
    usersControllers.connexion
);

//? Deconnexion of user
user.post(
    ROUTES.USER.DECONNEXION, 
    authUser,
    usersControllers.deconnexion
);

//? consultation of user
user.get(
    ROUTES.USER.GET_USER, 
    usersControllers.consultuser
);

//? update user
user.put(
    ROUTES.USER.UPDATE_USER,
    authUser,
    // validator.validateUser,
    // validate, 
    upload.single('image'),
    usersControllers.updateUserData
);

//? Delete user
user.delete(
    ROUTES.USER.DELETE_USER, 
    authUser,
    usersControllers.deleteUser
);

//? changepassword
user.put(
    ROUTES.USER.CHANGE_PASSSWORD,
    authUser,
    validator.validatePWDs,
    validate, 
    usersControllers.changePassword
);

//? reset password
user.put(
    ROUTES.USER.RESET_PASSSWORD,
    validator.validatenewPWD,
    validate, 
    usersControllers.resetPassword
);

//? verifyOTP
user.put(
    ROUTES.USER.VERIFY_OTP,
    validator.validateOTP,
    validate, 
    usersControllers.verifyOtp
);

//? resendOTP
user.get(
    ROUTES.USER.RESEND_OTP,
    validator.validateEmail,
    validate, 
    usersControllers.resendOTP
);


export default user;