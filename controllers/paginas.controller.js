exports.getHome = (req, res, next) => {
  res.redirect('/tienda');
};

exports.getAcerca = (req, res, next) => {
  res.render('acerca', {titulo: 'Acerca de la Tiendita'});
};

exports.getContacto = (req, res, next) => {
  res.render('contacto', {titulo: 'Contacto'});
};
