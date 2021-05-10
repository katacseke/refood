import multer from 'multer';
import path from 'path';

/**
 * Middleware that uploads the image from the specified file input to the server.
 * Throws an error if the extension or file size is incorrect.
 * This error can be handled in the handler, on which this middleware is defined.
 *
 * @param {String} inputName The name of the file input field.
 * @param {Number} maxSize The maximum file size in megabytes.
 *
 */
const imageUpload = (inputName, maxSize = 5) => async (req, res, next) => {
  const uploadConfig = multer({
    storage: multer.diskStorage({
      destination: './public/uploads',
      filename: (_req, file, callback) =>
        callback(
          null,
          `${file.fieldname}-${new Date().getTime()}${path.extname(file.originalname)}`
        ),
    }),
    fileFilter(_req, file, callback) {
      const ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        callback(new Error('Csak png, jpg vagy jpeg formátumú képeket tudunk elfogadni.'));
      }

      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * maxSize,
    },
  });

  uploadConfig.single(inputName)(req, res, next);
};

export default imageUpload;
