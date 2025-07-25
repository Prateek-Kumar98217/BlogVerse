import { Router } from "express";
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllCommentsAdmin, getDashboard } from "../controller/admin-controller.js";
import auth from '../middlewares/auth.js'

const adminRouter=Router()
adminRouter.post("/login",adminLogin)
adminRouter.get("/comments",auth,getAllCommentsAdmin)
adminRouter.get("/blogs",auth,getAllBlogsAdmin)
adminRouter.post("/delete-commment",auth,deleteCommentById)
adminRouter.post("/approve-commment",auth,approveCommentById)
adminRouter.get("/dashboard",auth,getDashboard)


export default adminRouter