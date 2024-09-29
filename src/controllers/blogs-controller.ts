import { Request, Response } from "express"
import prisma from "../core/config/prismaClient"
import { HttpCode } from "../core/constants"
import exceptions from "../utils/errors/exceptions"
import { BLOG, GLOBAL_MSG } from "../utils/mocks/mocks-message"
import generateUniqueSlug from "../functions/generateSlug"
import { customRequest } from '../core/Interfaces/interfaces';
import uploadImageToMinio from "../functions/uploader"


const blogsController = {
    // Function to create One blog
    create_one_blog: async(req: customRequest, res: Response) => {
        try {
            // fetch data from body
            const {title, content} = req.body
            
            // Fetch the author id to the creator of blog
            const authorID = req.user?.user_id;
            if(!authorID) return  res.status(HttpCode.UNAUTHORIZED).json({message: GLOBAL_MSG.UNAUTHORIZED})
console.log(authorID);
            
            // generate unique slug using the title
            const slug = generateUniqueSlug(title);
            
            // Make sure that the generated slug is really unique
            const isUnique = await prisma.blog.findFirst({where: {slug}});
            if(isUnique) return exceptions.badRequest(res, BLOG.UNIQUE_SLUG)
                
            // Define the update date at the date of the day
            const now = new Date();
            const createDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                
            const imageURL = await uploadImageToMinio(req); 

            // Create a new blog using that informations
            const new_blog = await prisma.blog.create({
                data: {
                    title, content, slug, image: imageURL, authorID: authorID, createdAt: createDate
                }
            })
            // Send error message if error appear
            if(!new_blog) return exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED)

            // Return success message if all is correct
            res.status(HttpCode.CREATED).json({msg: GLOBAL_MSG.SUCCESS, blog:  new_blog})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to create many blogs
    create_many_blog: async(req: customRequest, res: Response) => {
        try {
            // fetch data from body
            const {title, content} = req.body
            
            // Fetch the author id to the creator of blog
            const authorID = req.user?.user_id;
            if(!authorID) return  res.status(HttpCode.UNAUTHORIZED).json({message: GLOBAL_MSG.UNAUTHORIZED})
console.log(authorID);

            // generate unique slug using the title
            const slug = generateUniqueSlug(title);
            
            // Make sure that the generated slug is really unique
            const isUnique = await prisma.blog.findFirst({where: {slug}});
            if(isUnique) return exceptions.badRequest(res, BLOG.UNIQUE_SLUG)

            // Define the update date at the date of the day
            const now = new Date();
            const createDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            const imageURL = await uploadImageToMinio(req); 

            // Create a new blog using that informations
            const blogs = await prisma.blog.createMany({
                data: [{title, content, slug, image: imageURL, authorID: authorID, createdAt: createDate}]
            })
            if(blogs.count === 0) return exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED) 
                
            res.status(HttpCode.CREATED).json({msg: GLOBAL_MSG.SUCCESS, blogs: blogs})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to get/fetch One blog
    get_one_blog: async(req: Request, res: Response) => {
        try {
            // fetc bog ID from params
            const {blogID} = req.params

            const blog = await prisma.blog.findUnique({
                where: {blog_id: blogID},
                select: {
                    title: true, content: true, createdAt: true, updatedat: true, likes: true, slug: true, image: true, authorID: true
                }
            })
            if(!blog) return exceptions.notFound(res, GLOBAL_MSG.NOT_FOUND)

            res.status(HttpCode.OK).json({msg: blog});
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to get/fetch many blogs
    get_many_blog: async(req: Request, res: Response) => {
        try {
            const blogs = await prisma.blog.findMany({
                select: {
                    title: true, content: true, createdAt: true, updatedat: true, likes: true, slug: true, image: true, authorID: true
                }
            });

            res.status(HttpCode.OK).json({msg: blogs})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to modify/update One blog
    update_blog: async(req: customRequest, res: Response) => {
        try {
            const {blogID} = req.params
            // fetch data from body
            const {title, content} = req.body
            
            // Fetch the author id to the creator of blog
            const authorID = req.user?.user_id;
            if(!authorID) return  res.status(HttpCode.UNAUTHORIZED).json({message: GLOBAL_MSG.UNAUTHORIZED})
console.log(authorID);
            
            const blog = await prisma.blog.findUnique({where: {blog_id: blogID}});
            if(!blog) return exceptions.notFound(res, GLOBAL_MSG.NOT_FOUND);

            if(blog.authorID  !== authorID) return exceptions.badRequest(res, GLOBAL_MSG.UNAUTHORIZED)

            // generate unique slug using the title
            const slug = generateUniqueSlug(title);

            // Make sure that the generated slug is really unique
            const isUnique = await prisma.blog.findFirst({where: {slug}});
            if(isUnique) return exceptions.badRequest(res, BLOG.UNIQUE_SLUG)

            // Define the update date at the date of the day
            const now = new Date();
            const updateDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            const imageURL = await uploadImageToMinio(req); 

            const new_blog = await prisma.blog.update({
                where: {blog_id: blogID},
                data: {
                    title, content, slug, image: imageURL, authorID: authorID, updatedat: updateDate
                }
            })
            if(!new_blog) return exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED)

            res.status(HttpCode.OK).json({msg: GLOBAL_MSG.SUCCESS})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to delete One blog
    delete_one_blog: async(req: Request, res: Response) => {
        try {
            const {blogID} = req.params
            const blog = await prisma.blog.findUnique({where: {blog_id: blogID}});
            if(!blog) return exceptions.notFound(res, GLOBAL_MSG.NOT_FOUND);
            
            await prisma.blog.delete({where: {blog_id: blogID}})

            res.status(HttpCode.OK).json({msg: GLOBAL_MSG.SUCCESS})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to delete many blog
    delete_All_blogs: async(req: Request, res: Response) => {
        try {
            await prisma.blog.deleteMany()

            res.status(HttpCode.CREATED).json({msg: GLOBAL_MSG.SUCCESS})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    like_blog: async(req: Request, res: Response) => {
        try {
            const {blogID} = req.params

            const likeBlog = await prisma.blog.update({
                where: {blog_id: blogID},
                data: {
                    likes:  {increment: 1}
                }
            })
            if(!likeBlog) return  exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED)
            
            res.status(HttpCode.OK).json({msg: GLOBAL_MSG.SUCCESS})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    }
}

export default blogsController;