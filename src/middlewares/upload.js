const multer = require('multer');
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (fileTypes.includes(file.mimetype)) return cb(null, true);
  else return cb(new Error('不支援的檔案格式'), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = upload;
