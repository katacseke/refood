import path from 'path';
import multer from 'multer';
import formDataToObject from '@helpers/formDataToObject';

/**
 * Middleware that uploads the image from the specified file input to the server.
 * Sends respons with 422 if the extension or file size is incorrect.
 * It parses the other fields of the request data, and sets the
 * req.body[fileInput] field to the location of the uploaded file.
 *
 * @param {String} inputName The name of the file input field.
 * @param {Number} maxSize The maximum file size in megabytes.
 *
 */
const uploadImage = (inputName, maxSize = 5) => async (req, res, next) => {
  const uploadConfig = multer({
    storage: multer.diskStorage({
      destination: './public/uploads',
      filename: (_req, file, callback) =>
        callback(
          null,
          `${file.fieldname}-${new Date().getTime()}${path.extname(file.originalname)}`
        ),
    }),
    fileFilter: (_req, file, callback) => {
      const ext = path.extname(file.originalname);
      if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
        callback(new Error('Csak png, jpg vagy jpeg formátumú kép feltöltése lehetséges.'));
      }

      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * maxSize,
    },
  });

  uploadConfig.single(inputName)(req, res, (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? `A maximális méret ${maxSize} MB.` : err.message;
      res.status(422).json({ [inputName]: { message } });
      return;
    }

    delete req.body[inputName];
    req.body = formDataToObject(req.body);

    req.body[inputName] = req?.file?.path
      ? req.file.path.replace('\\', '/').replace('public/', '/')
      : null;

    next();
  });
};

export default uploadImage;
