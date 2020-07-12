const express = require('express');
const moment = require('moment');

const courseModel = require('../models/course.model');
const requestModel = require('../models/courseRequest.model');
const userModel = require('../models/user.model');
const config = require('../config/default.json');


const router = express.Router();

router.get('/', async (req,res) => {
  row = await courseModel.all();

  res.render('vwCourses/allCourses', 
  {
    courses: row,
    empty: row == null,
  }
  );

})
//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  row = await courseModel.singleById(id);

  res.render('vwCourses/detail', 
  {
    course: row,
    empty: row == null,
  }
  );

})

router.post('/', async (req, res) => {
  authUser = req.session.authUser;
  const item = req.body;
  item.userID = authUser._id;

  console.log(item);
  result = requestModel.add(item);

  entity = {_id: item.userID,
    wantToUpgrade: 1}

  userModel.patchWantToUpgrade(entity)
    row = null
  if(result)
  {
    success_message = "Đăng ký khóa học thành công"
    res.render('vwCourses/detail', 
    {
      course: row,
      empty: row == null,
      success_message,
    }
    );
  }
  else
  {
    err_message = "Đăng ký thất bại";
    res.render('vwCourses/detail', 
    {
      course: row,
      empty: row == null,
      err_message,
    }
    );
  }


})


module.exports = router;
//