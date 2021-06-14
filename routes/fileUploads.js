import express from 'express';
import uploadFundraiserImage from '../controllers/fileUploads.js';
import uploadImage from '../middleware/fileUpload.js';

const router = express.Router();

router.route('/fundraiser-image').post(uploadImage.single('image'), uploadFundraiserImage);

export default router;
