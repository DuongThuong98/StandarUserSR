const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
const userModel = require('../../models/user.model');


// const categoryModel = require('../models/category.model');

// const config = require('../config/default.json');

const router = express.Router();


router.get('/', async (req, res) => {
rows = []
  res.render('vwUser/upgrade', {
    mocktests: rows,
    empty: rows.length === 0
  });

});



function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}




module.exports = router;


// if (response.success == false) {
//   var r = confirm("Bạn muốn làm lại bài này?");
//   if (r == true) {
//     b = true;
//   } else {
//     b = false;
//   }
// }
// else {
//   b = true;
// }