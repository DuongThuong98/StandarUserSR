const express = require('express');
const moment = require('moment');
const bcrypt = require('bcryptjs');
let request = require('request');
const userModel = require('../models/user.model');
// const wishlistModel = require('../models/wishlist.model');
const restrict = require('../middlewares/auth.mdw');
// const mailingSystemModel = require('../models/mailingSystem.model');
// const emailHelper = require('../helpers/email.helper');
const functionHelper = require('../helpers/function.helper');

const router = express.Router();

router.get('/register', async (req, res) => {
  res.render('vwAccount/register');
});

router.post('/register', async (req, res) => {
  status = 1;
  let data = req.body;  // Dữ liệu từ form submit lên bao gồm thông tin đăng ký và captcha response

  console.log("data: ", data);
  const username = await userModel.singleByUsername(req.body.username).then(data =>data);
  // console.log(username);

  if (username !== null) {
    return res.render('vwAccount/register', { err_message: 'Username hoặc email đã có người dùng' });
  }
  else
  {
  userModel.add(data).then(data => console.log(data));
  res.render('vwAccount/register',
    { success_message: "Tạo tk thành công, vào email xác nhận" });
  }
});


router.get('/login', (req, res) => {
  res.render('vwAccount/login', { layout: false });
})

router.post('/login', async (req, res) => {
  const user = await userModel.singleByUsername(req.body.username).then(data => data);
  if (user === null)
    throw new Error('Invalid username or password.');

    console.log(user)
  const rs = bcrypt.compareSync(req.body.password, user[0].passwordHash);
  if (rs === false)
    return res.render('vwAccount/login', {
      layout: false,
      err_message: 'Login failed'
    });

  delete user.password;

  // wishlist = await wishlistModel.allByUserID(user.id);
  // console.log(wishlist);
  // req.session.wishlistLength = wishlist.length;
  req.session.isAuthenticated = true;
  req.session.authUser = user[0];
  req.session.u_role = user[0].typeID;
  const url = req.query.retUrl || '/';
  res.redirect(url);
})

// //tại sao chỗ này phải là post quên rồi?
// router.post('/logout', (req, res) => {
//   req.session.isAuthenticated = false;
//   req.session.authUser = null;
//   req.session.wishlistLength = 0;
//   req.session.u_role = null;
//   res.redirect(req.headers.referer);
// });



module.exports = router;

