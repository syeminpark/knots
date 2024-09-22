import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import image from '../controller/image.js';

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// POST route to handle image upload
router.post('/uploadImage', upload.single('image'), image.onUpload);

export default router;
