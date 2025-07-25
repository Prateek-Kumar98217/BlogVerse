import fs from 'fs';
import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import main from "../configs/gemini.js"

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

// ADD BLOG
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
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

// GET ALL PUBLISHED BLOGS
export const getAllblogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, message: "Blogs fetched", blogs });
  } catch (err) {
    console.error("Get blogs error:", err);
    res.status(500).json({ success: false, message: "Blogs not fetched" });
  }
};

// GET BLOG BY ID
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

// DELETE BLOG BY ID
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

// TOGGLE PUBLISH STATUS
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

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!blog || !name || !content) {
      return res.status(400).json({ success: false, message: "Missing fields in comment" });
    }

    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added" });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false, message: "Error adding comment" });
  }
};

// GET APPROVED COMMENTS FOR BLOG
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
