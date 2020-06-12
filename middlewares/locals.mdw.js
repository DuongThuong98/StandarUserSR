const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    //MENU 2 CẤP
    // const rows = await categoryModel.allWithDetails();
    // res.locals.lcCategories = rows;
    const rows = await categoryModel.cap2();
    // const row = await categoryModel.cap1();
    // console.log(rows);
    // console.log(rows[0].mangcap2);
    res.locals.lcCategories = rows;

    //xác nhận đăng nhập
    if (typeof (req.session.isAuthenticated) === 'undefined') {
      req.session.isAuthenticated = false;
    }
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;

    console.log("local: ", req.session.authUser)
    next();
  })
};

