// config/multer.js
import multer from 'multer';
import cloudinary from './cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const validateFileType = (req, res, next) => {
  // Configure Multer with memory storage
  const upload = multer({
    storage: multer.memoryStorage(), // Files are stored in memory temporarily
  }).array('imgs', 5); // Adjust the field name and limit as needed

  // First, run Multer to handle the file upload in memory
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'File upload error' });
    }

    // Now validate the file types after Multer stores them in memory
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const invalidFile = req.files.find(
      (file) => !allowedMimeTypes.includes(file.mimetype)
    );

    if (invalidFile) {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    next();
  });
};

export const folders = (req) => {
  let folder = '';
  if (req.body.type === 'profilepicture') {
    folder = 'profilepictures';
  } else if (req.body.type === 'productspicture') {
    folder = 'productspictures';
  } else {
    folder = 'misc';
  }
  return folder;
};

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: folders, // Hardcoded for testing
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
  
  },
});

export const upload = multer({ storage: storage });

