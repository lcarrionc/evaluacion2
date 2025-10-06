// middleware/auth.js
module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.session && req.session.authenticated) return next();
    return res.redirect('/login');
  }
};
