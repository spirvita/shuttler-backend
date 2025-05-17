// middleware/uploadErrorHandler.js
module.exports = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: '檔案已超過限制大小!' });
    }
    if (err.message.includes('不支援的檔案格式')) {
      return res.status(400).json({ message: '支援的檔案格式' });
    }
    return res.status(400).json({ message: 'Upload error', error: err.message });
  }
  next();
};
