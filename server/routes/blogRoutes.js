import {Router} from 'express'
import { addBlog, addComment, deleteBlogbyId, getAllblogs, getBlogbyId, getBlogComments, togglePublish, generateContent } from '../controller/blog-controller.js'
import upload from '../middlewares/multer.js'
import auth from '../middlewares/auth.js'

const blogRouter=Router()
blogRouter.post("/add",upload.single('image'),auth,addBlog)
blogRouter.get("/all",getAllblogs)
blogRouter.post("/delete",auth,deleteBlogbyId)
blogRouter.post("/toggle-publish",togglePublish)
blogRouter.post("/addComment",addComment)
blogRouter.post("/comments",getBlogComments)
blogRouter.post("/generate", auth, generateContent)
blogRouter.get("/:blogId",getBlogbyId)

export default blogRouter