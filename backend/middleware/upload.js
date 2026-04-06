const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary storage – images go to the 'civic_connect/complaints' folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'civic_connect/complaints',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  }
});

// File filter – only jpg/jpeg/png
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return cb(new Error('Only jpg, jpeg and png image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

module.exports = upload;