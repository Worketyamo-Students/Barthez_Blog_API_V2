import { Router } from "express";
import { auth } from "../middleware/authUser";
import usersControllers from "../controllers/users-controllers";
import { validate, validator } from "../services/validator/validator";
import ROUTES from "../utils/mocks/mocks-routes";

const user: Router = Router();

//? Inscription of new user
user.post(
    ROUTES.USER.INSCRIPTION, 
    validator.validateUser, 
    validate, 
    usersControllers.inscription
);

//? Connexion of user
user.post(
    ROUTES.USER.CONNEXION, 
    validator.validateUserAtLogin, 
    validate, 
    usersControllers.connexion
);

//? Deconnexion of user
user.post(
    ROUTES.USER.DECONNEXION, 
    auth.authToken,
    usersControllers.deconnexion
);

//? consultation of user
user.get(
    ROUTES.USER.GET_USER, 
    auth.authToken,
    usersControllers.consultuser
);

//? update user
user.put(
    ROUTES.USER.UPDATE_USER, 
    auth.authToken,
    validator.validateUser,
    validate, 
    usersControllers.updateUserData
);

//? Delete user
user.delete(
    ROUTES.USER.DELETE_USER, 
    auth.authToken,
    usersControllers.deleteUser
);

user.post(
    ROUTES.USER.REFRESH_TOKEN,
    validator.validateUserID,
    validate,
    usersControllers.refreshAccessToken
);

export default user;