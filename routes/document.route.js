const express = require('express');
const moment = require('moment');
const documentModel = require('../models/document.model');
const categoryModel = require('../models/category.model');

const config = require('../config/default.json');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const docId = req.params.id;
  const rows = await documentModel.findById(docId).then(data => data);
  console.log(rows);

  if (rows.length > 0) {
    await documentModel.upDateView(docId)
  }



  var isMockTest = await categoryModel.isMockTest(rows[0].categoryId)
  console.log(isMockTest)
  if (!isMockTest) {
    res.render('vwDocuments/detail', {
      document: rows[0],
    });
  }
  else {
    res.render('vwDocuments/detailMocktest', {
      // product: rows,
    });
  }


})

//dư thời gian thì làm kết hợp arrange vô
router.post('/search/key', async (req, res) => {

  console.log("search");
  console.log(req.body);
  searching = req.body;

  req.session.searchkey = { searchkey: searching.searchkey};

  searching = req.session.searchkey
  const catId = req.params.id;
  const limit = config.paginate.limit;
 
  let page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  

  await documentModel.countBySearch(searching.searchkey).then(data => {total = data})
  await documentModel.pageBySearch(searching.searchkey,offset).then(data => {rows = data})

  for (i = 0; i < rows.length; i++) {
    rows[i].created_at = moment(rows[i].createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('MMMM Do YYYY, h:mm:ss a');
  }
 
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

   console.log(rows);
    res.render('vwDocuments/allBySearch', {
      documents: rows,
      empty: rows.length === 0,
      page_numbers,
      prev_value: +page - 1,
      next_value: +page + 1,
      is_not_start: nPages > 1 && page > 1,
      is_not_last: nPages > page && nPages > 1,
      nPages,
      // current_time,
    });
  
})

router.get('/search/key', async (req, res) => {
  const catId = req.params.id;
  const limit = config.paginate.limit;
 
  searching = req.session.searchkey

  let page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  

  await documentModel.countBySearch(searching.searchkey).then(data => {total = data})
  await documentModel.pageBySearch(searching.searchkey,offset).then(data => {rows = data})

  for (i = 0; i < rows.length; i++) {
    rows[i].created_at = moment(rows[i].createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('MMMM Do YYYY, h:mm:ss a');
  }
 
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

   console.log(rows);
    res.render('vwDocuments/allBySearch', {
      documents: rows,
      empty: rows.length === 0,
      page_numbers,
      prev_value: +page - 1,
      next_value: +page + 1,
      is_not_start: nPages > 1 && page > 1,
      is_not_last: nPages > page && nPages > 1,
      nPages,
      // current_time,
    });

})

module.exports = router;