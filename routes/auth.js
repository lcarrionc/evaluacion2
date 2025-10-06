// routes/auth.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.get('/login', authCtrl.loginForm);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

module.exports = router;
