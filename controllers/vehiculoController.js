// controllers/vehiculoController.js
const Vehiculo = require('../models/Vehiculo');
const Marca = require('../models/Marca');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

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
  const vehiculos = await Vehiculo.findAll({ include: [{ model: Marca, as: 'marca' }] });
  res.render('vehiculos/list', { vehiculos });
};

exports.form = async (req, res) => {
  const marcas = await Marca.findAll();
  res.render('vehiculos/form', { vehiculo: null, marcas, errors: null });
};

exports.create = async (req, res) => {
  try {
    const { modelo, precio, id_marca } = req.body;
    const marcas = await Marca.findAll();
    // Validaciones
    const errors = [];
    if (!modelo) errors.push('modelo es obligatorio');
    if (!precio || isNaN(precio)) errors.push('precio es obligatorio y numérico');
    if (!id_marca) errors.push('marca es obligatoria');
    if (errors.length) return res.render('vehiculos/form', { errors, vehiculo: null, marcas });
    // Imagen
    let imagenPath = null;
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        imagenPath = await uploadToCloudinary(req.file.path, 'vehiculos');
        fs.unlinkSync(req.file.path);
      } else {
        imagenPath = '/' + req.file.path.replace(/\\/g, '/');
      }
    }
    await Vehiculo.create({ modelo, precio, id_marca, imagen_vehiculo: imagenPath });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/vehiculos');
  }
};

exports.editForm = async (req, res) => {
  const vehiculo = await Vehiculo.findByPk(req.params.id);
  const marcas = await Marca.findAll();
  res.render('vehiculos/form', { vehiculo, marcas, errors: null });
};

exports.update = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);
    const marcas = await Marca.findAll();
    if (!vehiculo) return res.redirect('/');

    const { modelo, precio, id_marca } = req.body;
    const errors = [];
    if (!modelo) errors.push('modelo es obligatorio');
    if (!precio || isNaN(precio)) errors.push('precio es obligatorio y numérico');
    if (!id_marca) errors.push('marca es obligatoria');
    if (errors.length) return res.render('vehiculos/form', { errors, vehiculo, marcas });

    let imagenPath = vehiculo.imagen_vehiculo;
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        imagenPath = await uploadToCloudinary(req.file.path, 'vehiculos');
        fs.unlinkSync(req.file.path);
      } else {
        imagenPath = '/' + req.file.path.replace(/\\/g, '/');
      }
    }

    await vehiculo.update({ modelo, precio, id_marca, imagen_vehiculo: imagenPath });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

exports.delete = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);
    if (vehiculo) await vehiculo.destroy();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};
