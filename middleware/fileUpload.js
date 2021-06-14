import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join('uploads', 'images', 'fundraisers'));
  },
  filename(req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${fileExtension}`;
    cb(null, fileName);
  },
});

const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const isFileExtensionValid = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = fileTypes.test(file.mimetype);

  if (isFileExtensionValid && isMimeTypeValid) {
    return cb(null, true);
  }
  return cb('Image invalid');
};

const uploadImage = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

export default uploadImage;
