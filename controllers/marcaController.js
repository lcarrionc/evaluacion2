// controllers/marcaController.js
const Marca = require('../models/Marca');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Config Cloudinary si existe
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

async function uploadToCloudinary(localPath, folder) {
  const res = await cloudinary.uploader.upload(localPath, { folder });
  return res.secure_url;
}

exports.list = async (req, res) => {
  const marcas = await Marca.findAll();
  res.render('marcas/list', { marcas });
};

exports.form = (req, res) => {
  res.render('marcas/form', { marca: null, errors: null, accion: 'nuevo' });
};

exports.create = async (req, res) => {
  try {
    const { nombre, pais_origen } = req.body;
    if (!nombre) return res.render('marcas/form', { errors: ['nombre es obligatorio'], marca: null });

    let imagenPath = null;
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        imagenPath = await uploadToCloudinary(req.file.path, 'marcas');
        fs.unlinkSync(req.file.path);
      } else {
        imagenPath = '/' + req.file.path.replace(/\\/g, '/');
      }
    }

    await Marca.create({ nombre, pais_origen, imagen_marca: imagenPath });
    res.redirect('/marcas');
  } catch (err) {
    console.error(err);
    res.render('marcas/form', { errors: [err.message], marca: null });
  }
};

exports.editForm = async (req, res) => {
  const marca = await Marca.findByPk(req.params.id);
  if (!marca) return res.redirect('/marcas');
  res.render('marcas/form', { marca, errors: null, accion: 'editar' });
};

exports.update = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (!marca) return res.redirect('/marcas');

    const { nombre, pais_origen } = req.body;
    if (!nombre) return res.render('marcas/form', { errors: ['nombre obligatorio'], marca });

    let imagenPath = marca.imagen_marca;
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        imagenPath = await uploadToCloudinary(req.file.path, 'marcas');
        fs.unlinkSync(req.file.path);
      } else {
        imagenPath = '/' + req.file.path.replace(/\\/g, '/');
      }
    }

    await marca.update({ nombre, pais_origen, imagen_marca: imagenPath });
    res.redirect('/marcas');
  } catch (err) {
    console.error(err);
    res.render('marcas/form', { errors: [err.message], marca: await Marca.findByPk(req.params.id) });
  }
};

exports.delete = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (marca) await marca.destroy();
    res.redirect('/marcas');
  } catch (err) {
    console.error(err);
    res.redirect('/marcas');
  }
};
