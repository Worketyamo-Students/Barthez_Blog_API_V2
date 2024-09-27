import { Request } from "express";

export interface IUser {
    user_id: string;
    name: string; 
    email: string; 
    password: string; 
}

export interface customRequest extends Request{
    user?: IUser;
}
