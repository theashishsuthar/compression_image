const express = require("express");
const router = express.Router();

const multer = require("multer");
const imageController = require("./controllers/imageController");

// Multer configuration for handling file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/api/compress-image",
  upload.single("image"),
  imageController.compressImage
);

module.exports = router;
