import { Response } from "express";
import { HttpCode } from "../../core/constants";

const exceptions = {
    badRequest: (res: Response, msg: string) => {
        res.status(HttpCode.BAD_REQUEST)
            .json({msg: msg})
    },

    notFound : (res: Response, msg: string) => {
        res.status(HttpCode.NOT_FOUND)
            .json({msg: msg})
    },

    conflict : (res: Response, msg: string) => {
        res.status(HttpCode.CONFLICT)
            .json({msg: msg})
    },

    forbiden : (res: Response, msg: string) => {
        res.status(HttpCode.FORBIDDEN)
            .json({msg: msg})
    },

    unauthorized : (res: Response, msg: string) => {
        res.status(HttpCode.UNAUTHORIZED)
            .json({msg: msg})
    },

    serverError : (res: Response, error: unknown) => {
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({msg: error})
    }
}

export default exceptions;