import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Error in adminLogin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    console.error("Error in getAllBlogsAdmin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    console.error("Error in getAllCommentsAdmin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = { blogs, comments, drafts, recentBlogs };
    res.json({ success: true, dashboard: dashboardData });
  } catch (err) {
    console.error("Error in getDashboard:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.json({ success: true, message: "Comment deleted", comment: deleted });
  } catch (err) {
    console.error("Error in deleteCommentById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    const updated = await Comment.findByIdAndUpdate(id, { isApproved: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.json({ success: true, message: "Comment approved" });
  } catch (err) {
    console.error("Error in approveCommentById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
