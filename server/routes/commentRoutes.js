const express = require("express");
const {
  createComment,
  getComment,
  editComment,
  deleteComment,
} = require("../controllers/commentControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createComment);
router.get("/:id", getComment);
router.patch("/edit/:id", authMiddleware, editComment);
router.delete("/delete/:id", authMiddleware, deleteComment);

module.exports = router;
