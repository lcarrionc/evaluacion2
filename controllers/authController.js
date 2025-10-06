// controllers/authController.js
require('dotenv').config();

exports.loginForm = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const admin = 'admin';
  const pass = 'admin123';

  if (username === admin && password === pass) {
    req.session.authenticated = true;
    req.session.user = { username };
    return res.redirect('/');
  }
  res.render('auth/login', { error: 'Credenciales inválidas' });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
