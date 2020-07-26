const express = require('express');
const moment = require('moment');
const bcrypt = require('bcryptjs');
let request = require('request');
const userModel = require('../models/user.model');
// const wishlistModel = require('../models/wishlist.model');
const restrict = require('../middlewares/auth.mdw');
const mailingModel = require('../models/mailing.model');
const emailHelper = require('../helpers/email.helper');
const functionHelper = require('../helpers/function.helper');

const router = express.Router();

router.get('/register', async (req, res) => {
  res.render('vwAccount/register');
});

router.post('/register', async (req, res) => {
  status = 1;
  let data = req.body;  // Dữ liệu từ form submit lên bao gồm thông tin đăng ký và captcha response

  let captchaResponse = data['g-recaptcha-response'];

  if (captchaResponse) {
    request({
      url: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      form: {
        secret: '6LcjNswUAAAAAIx5wwucHDcdI1lxIaVhhmHw1emv',
        response: captchaResponse
      }
    }, function (error, response, body) {
      // Parse String thành JSON object
      try {
        body = JSON.parse(body);
      } catch (err) {
        body = {};
      }
      if (!error && response.statusCode == 200 && body.success) {
        // Captcha hợp lệ, xử lý tiếp phần đăng ký tài khoản 
        console.log("thành công");
      } else {
        // Xử lý lỗi nếu Captcha không hợp lệ
        status = 2;
      }
    });
  } else {
    // Xử lý lỗi nếu không có 
    status = 3;
    console.log("lỗi capcha");

  }

  console.log("captcha: " + data['g-recaptcha-response'])
  console.log("data: ", data);
  if (status == 2) {
    res.render('vwAccount/register', { err_message: "Captcha ko hợp lệ" });
  }

  if (status == 3) {
    res.render('vwAccount/register', { err_message: "Yêu cầu điền Captcha" });
  }
  //kiểm tra username, email
  if (status == 1) {

    const username = await userModel.singleByUsername(req.body.username).then(data => data);
    // console.log(username);

    if (username !== null) {
      return res.render('vwAccount/register', { err_message: 'Username hoặc email đã có người dùng' });
    }
    else {
      result = await userModel.add(data);
      var tokenEmail = functionHelper.createToken();
      console.log("RESULT11: ", result);

      entityEmail = {
        id_receiver: result._id,
        type: "register",
        status_mail: 0,
        token_email: tokenEmail
      };
      await mailingModel.add(entityEmail);
      content = '<h1>Link: <a href="http://localhost:3001/account/ota/' + tokenEmail + '">vào đây</a></h1>';
      if (process.env.PORT) {
        content = '<h1>Link: <a href="https://mielts.herokuapp.com/account/ota' + tokenEmail + '">vào đây</a></h1>';
      }


      emailHelper.sendmail(data.email, '[Standard] Xác nhận tài khoản', content);
      res.render('vwAccount/register',
        { success_message: "Tạo tk thành công, vào email xác nhận" });
    }
  }
});


router.get('/ota/:token', async (req, res) => {
  const token = req.params.token;
  ota = await mailingModel.findByToken(token);
  if (ota) {
    console.log(ota)

    timeNow = parseInt(moment().unix());
    timeThen = parseInt(moment(ota.createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('X'));
    sec = timeNow - timeThen
    console.log("sec: ", sec);
    if (sec > 60) {
      ota.overtime = true;
    }
    else {
      if (ota.status == 1) {
        ota.overdo = true;
      }
      else {
        ota.done = true
        entity = { _id: ota.id_receiver, isActive: true };
        userModel.patchStatus(entity)
      }
    }

  }
  else {

  }

  res.render('vwAccount/ota', {
    ota: ota,
    empty: ota == null,
    layout: false
  });
})

router.get('/remail', async (req, res) => {
  res.render('vwAccount/remail');
})

router.post('/remail', async (req, res) => {
  email = req.body.email;

  var tokenEmail = functionHelper.createToken();
  user = await userModel.singleByEmail(email);

  entityEmail = {
    id_receiver: user._id,
    type: "register",
    status_mail: 0,
    token_email: tokenEmail
  };
  await mailingModel.add(entityEmail);
  content = '<h1>Link: <a href="http://localhost:3001/account/ota/' + tokenEmail + '">vào đây</a></h1>';
  if (process.env.PORT) {
    content = '<h1>Link: <a href="https://mielts.herokuapp.com/account/ota' + tokenEmail + '">vào đây</a></h1>';
  }


  emailHelper.sendmail(email, '[Standard] Xác nhận tài khoản', content);
  res.render('vwAccount/remail',
    { success_message: "Vào email xác nhận" });
})



router.get('/login', (req, res) => {
  res.render('vwAccount/login', {
    layout: false
  });
})

router.post('/login', async (req, res) => {
  const user = await userModel.singleByUsername(req.body.username).then(data => data);
  if (user === null) {
    return res.render('vwAccount/login', {
      layout: false,
      err_message: 'Không tồn tại tài khoản này'
    });
  }
  else {
    console.log("USER: ", user)
    if (user[0].isActive == false) {
      return res.render('vwAccount/login', {
        layout: false,
        err_message: 'Tài khoản chưa được kích hoạt',
        remailLink: "/account/remail"
      });
    }
    else {

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
      req.session.u_role = user[0].role;
      const url = req.query.retUrl || '/';
      res.redirect(url);
    }

  }
})

// //tại sao chỗ này phải là post quên rồi?
router.post('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  req.session.wishlistLength = 0;
  req.session.u_role = null;
  res.redirect(req.headers.referer);
});



module.exports = router;

