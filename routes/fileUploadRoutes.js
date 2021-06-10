import express from 'express';
import uploadFundraiserImage from '../controllers/fileUploadController.js';
import uploadImage from '../middleware/fileUploadMiddleware.js';

const router = express.Router();

router.route('/fundraiser-image').post(uploadImage.single('image'), uploadFundraiserImage);

export default router;
