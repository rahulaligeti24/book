import multer from 'multer';

const allowedMimeTypes = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);

const storage = multer.memoryStorage();

export const uploadBookDataset = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const hasValidMimeType = allowedMimeTypes.has(file.mimetype);
    const hasValidExtension = /\.(csv|xlsx|xls)$/i.test(file.originalname);

    if (hasValidMimeType || hasValidExtension) {
      callback(null, true);
      return;
    }

    callback(new Error('Only CSV and Excel files are supported'));
  }
});

