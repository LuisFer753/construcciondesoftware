module.exports = function(requiredPermisos = []) {
  return (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login');
    }

    const userPerms = req.session.permisos || [];
    const tieneTodos = requiredPermisos.every(p => userPerms.includes(p));

    if (!tieneTodos) {
      return res.status(403).render('403', {
        titulo: 'Acceso prohibido'
      });
    }

    next();
  };
};
