const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
  app.use('/account', require('../routes/account.route'));
  app.use('/categories', require('../routes/category.route'));
  app.use('/documents', require('../routes/document.route'));
  app.use('/courses', require('../routes/course.route'));
  // app.use('/authemail', require('../routes/authEmail.route'));
 
  app.use('/user',restrict.user ,require('../routes/user/info.route'));
  app.use('/user/mocktest',restrict.user ,require('../routes/user/mocktest.route'));
  app.use('/user/wishlist',restrict.user ,require('../routes/user/wishlist.route'));
  app.use('/user/upgrade',restrict.user ,require('../routes/user/upgrade.route'));

  app.use('/teacher',restrict.teacher ,require('../routes/teacher/info.route'));
  app.use('/teacher/documents',restrict.teacher ,require('../routes/teacher/document.route'));
  app.use('/teacher/courses',require('../routes/teacher/course.route'));


  // app.use('/admin/users',restrict.admin ,require('../routes/admin/users.route'));
  // app.use('/admin/categories',restrict.admin ,require('../routes/admin/categories.route'));

};

