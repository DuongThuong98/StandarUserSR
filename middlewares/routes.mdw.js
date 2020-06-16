const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
  app.use('/account', require('../routes/account.route'));
  app.use('/categories', require('../routes/category.route'));
  app.use('/documents', require('../routes/document.route'));
  // app.use('/authemail', require('../routes/authEmail.route'));
 
  app.use('/users',restrict.user ,require('../routes/user/info.route'));

  app.use('/teacher',restrict.teacher ,require('../routes/teacher/info.route'));

  app.use('/teacher/documents',restrict.teacher ,require('../routes/teacher/document.route'));
  // app.use('/seller/soldlist',restrict.seller ,require('../routes/seller/soldlist.route'));

  // app.use('/admin/users',restrict.admin ,require('../routes/admin/users.route'));
  // app.use('/admin/categories',restrict.admin ,require('../routes/admin/categories.route'));

};

