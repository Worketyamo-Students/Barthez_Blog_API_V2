import { Router } from "express";
import ROUTES from "../utils/mocks/mocks-routes";
import upload from "../middleware/upload-file";
import { uploadImage } from "../controllers/upload-file-controllers";


const uploadIMG: Router = Router(); 

uploadIMG.post(
    ROUTES.UPLOAD.UPLOAD, 
    upload.single('image'),
    uploadImage
)

export default uploadIMG;
