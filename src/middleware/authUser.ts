import { NextFunction, Response } from "express";
import { HttpCode } from "../core/constants";
import { customRequest } from '../core/Interfaces/interfaces';
import userToken from "../services/jwt/jwt-functions";
import exceptions from "../utils/errors/exceptions";
import { envs } from "../core/config/env";

const authUser = async (req: customRequest, res: Response, next: NextFunction) => {
    try {            
        const accessToken = req.headers['authorization']?.split(" ")[1] || "";

        if (accessToken) {
            try {
                // Essayer de vérifier le token
                const userData = userToken.verifyAccessToken(accessToken);
                if (userData) {
                    req.user = userData;
                    return next();
                }
            } catch (err) {
                // Si le token est expiré, vérifier le refresh token
                if (err.name === "TokenExpiredError") {
                    console.log("Access token expired. Trying refresh token...");
                } else {
                    throw err; // Si c'est une autre erreur, la propager
                }
            }
        }

        // Vérification du refresh token si le token d'accès est expiré ou absent
        let refreshToken = req.cookies['refresh_key'];

        if (!refreshToken) {
            return exceptions.unauthorized(res, "Invalid or expired tokens. Please log in again.");
        }

        const user = userToken.verifyRefreshToken(refreshToken);

        if (!user) {
            return exceptions.unauthorized(res, "Invalid or expired refresh token.");
        }

        // Générer un nouveau access token
        user.password = "";
        const newAccessToken = userToken.accessToken(user);
        res.setHeader('authorization', `Bearer ${newAccessToken}`);

        // Mettre à jour le refresh token
        refreshToken = userToken.refreshToken(user);
        res.clearCookie('refresh_key', {
            secure: envs.JWT_COOKIE_SECURITY,
            httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
            sameSite: 'strict',
        });
        res.cookie('refresh_key', refreshToken, {
            httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
            secure: envs.JWT_COOKIE_SECURITY,
            maxAge: envs.JWT_COOKIE_DURATION,
        });

        const newUserData = userToken.verifyAccessToken(newAccessToken);
        if (!newUserData) {
            return exceptions.unauthorized(res, "Failed to generate a valid access token.");
        }

        req.user = newUserData;
        return next();
    } catch (error) {
        console.error(error);
        return res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({ msg: "Authentication error." });
    }
};


export default authUser;