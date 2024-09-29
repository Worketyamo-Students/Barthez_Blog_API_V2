import { Router } from "express";
import ROUTES from "../utils/mocks/mocks-routes";
import { auth } from "../middleware/authUser";
import { validate, validator } from "../services/validator/validator";
import blogsController from "../controllers/blogs-controller";
import upload from "../middleware/upload-file";


const blog: Router = Router()

blog.get(
    ROUTES.BLOG.GET_ONE_BLOG,
    blogsController.get_one_blog
)

// Get all blogs 
blog.get(
    ROUTES.BLOG.GET_MANY_BLOG,
    // auth.authToken,
    blogsController.get_many_blog
)

// Add new blog 
blog.post(
    ROUTES.BLOG.CREATE_ONE_BLOG,
    auth.authToken,
    validator.validateBlog,
    validate,
    upload.single('image'),
    blogsController.create_one_blog
)

// Add Many blogs 
blog.post(
    ROUTES.BLOG.CREATE_MANY_BLOG,
    // auth.authToken,
    validator.validateBlog,
    validate,
    blogsController.create_many_blog
)

// Update blog
blog.put(
    ROUTES.BLOG.UPDATE_BLOG,
    auth.authToken,
    // validator.validateBlog,
    // validate, 
    upload.single('image'),
    blogsController.update_blog
)

// Delete One blog
blog.delete(
    ROUTES.BLOG.DELETE_ONE_BLOG,
    auth.authToken,
    blogsController.delete_one_blog
)

// Delete ALL blog
blog.delete(
    ROUTES.BLOG.DELETE_MANY_BLOG,
    auth.authToken,
    // roleAdmin,
    blogsController.delete_All_blogs
)

// Like blog //! update the controllers of this routes
blog.put(
    ROUTES.BLOG.LIKE_BLOG,
    blogsController.like_blog
)
export default blog;