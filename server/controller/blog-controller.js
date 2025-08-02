import fs from 'fs';
import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import main from "../configs/gemini.js"
import { blogValidator } from '../validator/blog-validator.js';
import { commentValidator } from '../validator/comment-validator.js';

export const generateContent=async(req, res)=>{
    try{
            const { prompt } = req.body;

    const fullPrompt = `You are a helpful AI content writer. Write a complete and engaging blog post on the topic: "${prompt}".
        Instructions:
        - Write in a simple, easy-to-understand tone for a general audience.
        - Structure the blog with an Introduction, Body (with subheadings), and Conclusion.
        - Use markdown formatting (e.g., ## for headings, * for bullet points).
        - Avoid fluff; be informative, clear, and concise.
        - Include examples if applicable.
            `.trim();
        const content= await main(fullPrompt);
        res.json({success: true, content})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const addBlog = async (req, res) => {
  try {
    const blog= JSON.parse(req.body.blog)
        // console.log("blog is ",typeof blog)
        const {value,error}=blogValidator.validate(blog)
        // console.log("value is ",value)
        // console.log("type of value",typeof value)
        if(error){
          console.log(error)
            return res.status(400).json({message:"error in validation"})
        }
        
    const { title, subTitle, description, category, isPublished } = value;
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" }
      ]
    });

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    console.error("Add blog error:", err);
    res.status(500).json({ success: false, message: "Blog creation failed" });
  }
};

export const getAllblogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, message: "Blogs fetched", blogs });
  } catch (err) {
    console.error("Get blogs error:", err);
    res.status(500).json({ success: false, message: "Blogs not fetched" });
  }
};

export const getBlogbyId = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, message: "Blog fetched", blog });
  } catch (err) {
    console.error("Get blog by ID error:", err);
    res.status(500).json({ success: false, message: "Error fetching blog" });
  }
};

export const deleteBlogbyId = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog and related comments deleted" });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ success: false, message: "Blog deletion error" });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, message: `Blog ${blog.isPublished ? 'published' : 'unpublished'}` });
  } catch (err) {
    console.error("Toggle publish error:", err);
    res.status(500).json({ success: false, message: "Error updating publish status" });
  }
};

export const addComment = async (req, res) => {
  try {
    const body=req.body;
    //console.log(body)
    const {value,error}=commentValidator.validate(body);
    if(error){
      return res.status(400).json({ success: false, message: "Invalid comment data"})
    }
    const { blogId, name, content } = value;

    if (!blogId || !name || !content) {
      return res.status(400).json({ success: false, message: "Missing fields in comment" });
    }

    await Comment.create({ blog: blogId, name, content });
    res.json({ success: true, message: "Comment added" });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false, message: "Error adding comment" });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;

    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });

    res.json({ success: true, message: "Comments fetched", comments });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ success: false, message: "Error fetching comments" });
  }
};
