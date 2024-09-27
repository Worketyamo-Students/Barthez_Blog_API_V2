import { NextFunction, Response } from "express";
import { HttpCode } from "../core/constants";
import { customRequest } from "../core/Interfaces/interfaces";
import userToken from "../services/jwt/jwt-functions";
import exceptions from "../utils/errors/exceptions";

export const auth = {
    authToken: async(req: customRequest, res: Response, next: NextFunction) => {
        try {
            // Fetch access token from header
            const accessToken = req.headers['authorization']?.split(" ")[1] || "";
            if(!accessToken || (accessToken && accessToken.startsWith('Bearer '))) return exceptions.unauthorized(res, "Invalid or exipred token !");
            
            const userData = userToken.verifyAccessToken(accessToken);             
            if(!userData) return exceptions.unauthorized(res, "Access token not found or not format well !");

            req.user = userData;
            next();
        } catch (error) {
            return(
                res
                    .status(HttpCode.INTERNAL_SERVER_ERROR)
                    .json({msg: "error when try to authenticate."})
            ) 
        }
    } 
}

