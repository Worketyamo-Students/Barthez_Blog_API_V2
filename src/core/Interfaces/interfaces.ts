import { Request } from "express";

export interface IUser {
    user_id: string;
    name: string; 
    email: string; 
    password: string; 
    profile?: string;
    blog: IBlog
}



interface IBlog{
    blog_id:   string;   
    title:     string;
    content:   string;
    createdAt: Date;
    updatedat: Date;
    likes:     number;
    slug:      string;
    image?:     string;
    authorID:  string;
}

export interface customRequest extends Request{
    user?: IUser;
}
