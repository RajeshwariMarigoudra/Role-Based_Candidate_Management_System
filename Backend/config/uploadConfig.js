const multer = require('multer');

// Memory storage to store the file in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file if it's an image
    } else {
      cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }
  }
});

module.exports = upload;
