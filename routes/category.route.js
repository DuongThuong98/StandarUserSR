const express = require('express');
// const moment = require('moment');
// const productModel = require('../models/product.model');
// const categoryModel = require('../models/category.model');
// const subImageModel = require('../models/subImage.model')
// const userModel = require('../models/user.model');
const config = require('../config/default.json');


const router = express.Router();

router.get('/',(req,res) => {res.send("kaka")})
//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/documents',  (req, res) => {
  // const catId = req.params.id;
  // const limit = config.paginate.limit;
 
  // let page = req.query.page || 1;
  // if (page < 1) page = 1;
  // const offset = (page - 1) * config.paginate.limit;
console.log("lala")
  res.render('vwDocuments/allByCat', 
  // {
  //   documents: rows,
  //   empty: rows.length === 0,
  //   page_numbers,
  //   prev_value: +page - 1,
  //   next_value: +page + 1,
  //   is_not_start: nPages > 1 && page > 1,
  //   is_not_last: nPages > page && nPages > 1,
  //   nPages,
  //   current_time,
  //   catId
  // }
  );
})


module.exports = router;