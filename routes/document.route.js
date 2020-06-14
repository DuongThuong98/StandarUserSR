const express = require('express');
const documentModel = require('../models/document.model');
const categoryModel = require('../models/category.model');


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



module.exports = router;