const express = require('express');
const moment = require('moment');
const documentModel = require('../models/document.model');
const courseModel = require('../models/course.model');
const requestModel = require('../models/courseRequest.model');
// const categoryModel = require('../models/category.model');
const config = require('../config/default.json');


const router = express.Router();

router.get('/',(req,res) => {res.send("kaka")})
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
  requestModel.add(item);
  
  row = null
  res.render('vwCourses/detail', 
  {
    course: row,
    empty: row == null,
  }
  );

})


module.exports = router;
//