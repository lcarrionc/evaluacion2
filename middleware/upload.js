// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpetas por tipo
const ensureDir = dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tipo = req.baseUrl.includes('marcas') ? 'uploads/marcas' : 'uploads/vehiculos';
    ensureDir(tipo);
    cb(null, tipo);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo imágenes (jpeg, png, gif)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
