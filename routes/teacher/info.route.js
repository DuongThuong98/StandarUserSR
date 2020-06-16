const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');


const userModel = require('../../models/user.model');

const router = express.Router();

//INFO
router.get('/', async (req, res) => {
  res.redirect("/info");
});

router.get('/info', async (req, res) => {
  authUser = req.session.authUser;
  res.render('vwTeacher/info', { authUser });
});

router.post('/info', async (req, res) => {
  const temp_user =  req.session.authUser;
 
  // authUser = req.session.authUser;
  // console.log(authUser);

  var form_user = req.body;
  if (form_user.is_change_pass === 'on') {
    delete form_user.is_change_pass;
    console.log("dasf:" + form_user.is_change_pass);
    const rs = bcrypt.compareSync(form_user.old_password, temp_user.passwordHash);
    if (rs === false)
      return res.render('vwTeacher/info', {
        err_message: 'Mật khẩu cũ không đúng'
      });
    else {
      const hash = bcrypt.hashSync(form_user.new_password, 10);
      form_user.passwordHash = hash;
    }

  }

  delete form_user.old_password;
  delete form_user.new_password;
  form_user._id = temp_user._id;
  console.log("form user",form_user);
  // console.log(temp_user);
  data = await userModel.patch(form_user);
  console.log(data);
if(data!=null){
  req.session.authUser = data;
}
  res.render('vwTeacher/info', {
    authUser: form_user,
    success_message: "Thay đổi thành công"
  });
});

//DANH SÁCH ĐÁNH GIÁ

router.get('/info', async (req, res) => {
  authUser = req.session.authUser;
  res.render('vwTeacher/info', { authUser });
});





module.exports = router;

