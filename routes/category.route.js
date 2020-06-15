const express = require('express');
const moment = require('moment');
const documentModel = require('../models/document.model');
// const categoryModel = require('../models/category.model');
const config = require('../config/default.json');


const router = express.Router();

router.get('/',(req,res) => {res.send("kaka")})
//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/documents', async (req, res) => {
  if (typeof (req.session.arrange) === 'undefined' ) {
    if( typeof (req.query.arrange) === 'undefined')
    req.session.arrange = 0;
    else
    req.session.arrange = req.query.arrange;
  }
  else {
    if (typeof (req.session.arrange) !== 'undefined') {
      if( typeof (req.query.arrange) !== 'undefined')
      req.session.arrange = req.query.arrange;
    }
  }
  const arrange = req.session.arrange;
  // console.log(arrange);
  // console.log(typeof (req.session.arrange))
  // console.log(typeof (req.query.arrange))

  const catId = req.params.id;
  const limit = config.paginate.limit;
 
  let page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  

  await documentModel.countByCat(catId).then(data => {total = data})
  await documentModel.pageByCat(catId,offset,arrange).then(data => {rows = data})

  for (i = 0; i < rows.length; i++) {
    rows[i].created_at = moment(rows[i].createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('MMMM Do YYYY, h:mm:ss a');
    //console.log(moment(rows[i].createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('MMMM Do YYYY'))
  }
  // rows = await documentModel.pageByCat(catId,offset).then(data =>{return data})
  // console.log("lala", offset)
  // console.log( "ROWS " + total)
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
    catId
  }
  );
})


module.exports = router;
//