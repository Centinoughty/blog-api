const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/PostModel");

const router = express.Router();

// Create a post
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  if (!title.trim() || !content.trim()) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const post = new Post({ title, content, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Find all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Interval Server Error" });
  }
});

// Find a post
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit a post
// Authenticate the user before deleting
router.put("/:id", auth, async (req, res) => {
  let { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Invalid post id" });
    }

    if (post.author._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (title) {
      title = title.trim();
    }

    if (content) {
      content = content.trim();
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a post
// Authenticate user before deleting
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted succesfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
