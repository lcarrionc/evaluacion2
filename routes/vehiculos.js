// routes/vehiculos.js
const express = require('express');
const router = express.Router();
const vehCtrl = require('../controllers/vehiculoController');
const upload = require('../middleware/upload');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, vehCtrl.list);
router.get('/new', ensureAuth, vehCtrl.form);
router.post('/', ensureAuth, upload.single('imagen_vehiculo'), vehCtrl.create);
router.get('/:id/edit', ensureAuth, vehCtrl.editForm);
router.put('/:id', ensureAuth, upload.single('imagen_vehiculo'), vehCtrl.update);
router.delete('/:id', ensureAuth, vehCtrl.delete);

module.exports = router;
