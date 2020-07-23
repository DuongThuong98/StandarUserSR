const express = require("express");
const moment = require("moment");
const db = require("../scheme_model");
const courseModel = require("../models/course.model");
const requestModel = require("../models/courseRequest.model");
const userModel = require("../models/user.model");
const config = require("../config/default.json");

const router = express.Router();

router.get("/", async (req, res) => {
  row = await courseModel.all();

  row.forEach(element => {
    element.createdDay = moment(element.createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('M-D-YYYY');
  });
  res.render('vwCourses/allCourses', 
  {
    courses: row,
    empty: row == null,
  });
});
//
// xem ds Tài liệu thuộc danh mục :id

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  authUser = req.session.authUser;
  console.log(authUser);
  var userID = authUser ? authUser._id : null;
  var isRegister = true;

  row = await courseModel.singleById(id);
  row.created_at = moment(row.createdAt, "YYYY-MM-DDTHH:mm:ss[Z]").format(
    "MMMM Do YYYY, h:mm:ss a"
  );

  if (userID) {
    const course = await db.Course.findById({ _id: id });

    if (course.studentList.length > 0) {
      const found = course.studentList.find(
        (x) => x.toString() === userID.toString()
      );
      console.log(found);
      if (found) {
        isRegister = false;
      }
    }
  }

  res.render("vwCourses/detail", {
    authUserID: authUser ? authUser._id : null,
    course: row,
    empty: row == null,
    isRegister,
  });
});

router.post("/", async (req, res) => {
  authUser = req.session.authUser;
  const item = req.body;
  item.userID = authUser._id;

  console.log(item);
  result = requestModel.add(item);

  entity = { _id: item.userID, wantToUpgrade: 1 };

  userModel.patchWantToUpgrade(entity);
  row = null;
  if (result) {
    success_message = "Đăng ký khóa học thành công";
    res.render("vwCourses/detail", {
      course: row,
      empty: row == null,
      success_message,
    });
  } else {
    err_message = "Đăng ký thất bại";
    res.render("vwCourses/detail", {
      course: row,
      empty: row == null,
      err_message,
    });
  }
});

module.exports = router;
//
