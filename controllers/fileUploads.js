import asyncHandler from 'express-async-handler';

/**
   * @desc    Upload fundraiser Image
   * @route   POST /api/v1/file-uploads/fundraiser-image
   * @access  Private
   */
const uploadFundraiserImage = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: `${req.file.path}` });
});

export default uploadFundraiserImage;
