const fs = require("fs");
const { decode, encode } = require("jpeg-js");
const PNG = require("pngjs").PNG;

const compressImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }

  const imagePath = req.file.path;

  try {
    // Read the image file
    const rawData = fs.readFileSync(imagePath);

    let encodedData;

    // Check if the image is PNG
    // Check if the image is PNG
    if (isPNG(rawData)) {
      // Convert PNG to JPEG by decoding and encoding
      const png = PNG.sync.read(rawData);
      const { data, width, height } = png;
      encodedData = encode({ data, width, height }, 50); // Adjust the quality parameter as desired (0-100)
    } else {
      // The image is already in JPEG format, perform compression directly
      const rawImage = decode(rawData, { maxMemoryUsageInMB: 2000 });
      encodedData = encode(rawImage, 50); // Adjust the quality parameter as desired (0-100)
    }

    // Save the compressed image data to a file or send it as a response
    const compressedImagePath = `${imagePath}_compressed.jpg`;
    fs.writeFileSync(compressedImagePath, encodedData.data);

    // Remove the temporary image file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(
          "Error occurred while deleting the temporary image:",
          err
        );
      }
    });

    res.json({ compressedImagePath });
  } catch (error) {
    console.error("Error occurred while compressing the image:", error);
    res.status(500).json({ error: "Failed to compress the image." });
  }
};

// Function to check if the given buffer is a PNG image
function isPNG(buffer) {
  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
  const signatureBytes = buffer.slice(0, 8);
  for (let i = 0; i < pngSignature.length; i++) {
    if (signatureBytes[i] !== pngSignature[i]) {
      return false;
    }
  }
  return true;
}

module.exports = {
  compressImage,
};
