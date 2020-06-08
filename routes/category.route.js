const express = require('express');
const documentModel = require('../models/document.model');
// const categoryModel = require('../models/category.model');
const config = require('../config/default.json');


const router = express.Router();

router.get('/',(req,res) => {res.send("kaka")})
//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/documents', async (req, res) => {
  const catId = req.params.id;
  const limit = config.paginate.limit;
 
  let page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  
  await documentModel.countByCat(catId).then(data => {total = data})
  await documentModel.pageByCat(catId,offset).then(data => {rows = data})
  // rows = await documentModel.pageByCat(catId,offset).then(data =>{return data})
  console.log("lala", offset)
  console.log( "ROWS " + total)
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }
  res.render('vwDocuments/allByCat', 
  {
    documents: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
    is_not_start: nPages > 1 && page > 1,
    is_not_last: nPages > page && nPages > 1,
    nPages,
  //   current_time,
  //   catId
  }
  );
})


module.exports = router;
//