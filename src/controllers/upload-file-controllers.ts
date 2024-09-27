import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { UPLOAD_MSG } from "../utils/mocks/mocks-message";
import exceptions from "../utils/errors/exceptions";

export const uploadImage = (req: Request, res: Response) => {
    try {
        // Multer ajoute le fichier dans req.file
        if (!req.file) return res.status(400).json({ message: UPLOAD_MSG.FAILED_UPLOAD });

        // URL de l'image stockée dans S3
        const imageUrl = (req.file as Express.MulterS3.File).location;

        res.status(HttpCode.OK).json({
        message: UPLOAD_MSG.SUCCESS,
        imageUrl: imageUrl
        });
    } catch (error) {
        exceptions.serverError(res, error);
    }
};
