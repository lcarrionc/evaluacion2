// routes/marcas.js
const express = require('express');
const router = express.Router();
const marcaCtrl = require('../controllers/marcaController');
const upload = require('../middleware/upload');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, marcaCtrl.list);
router.get('/new', ensureAuth, marcaCtrl.form);
router.post('/', ensureAuth, upload.single('imagen_marca'), marcaCtrl.create);
router.get('/:id/edit', ensureAuth, marcaCtrl.editForm);
router.put('/:id', ensureAuth, upload.single('imagen_marca'), marcaCtrl.update);
router.delete('/:id', ensureAuth, marcaCtrl.delete);

module.exports = router;
