const express = require('express');
const documentModel = require('../models/document.model');


const router = express.Router();

router.get('/:id', async (req, res) => {
  const docId = req.params.id;
  const rows = await documentModel.findById(docId).then(data => data);
  console.log(rows);

 
  res.render('vwDocuments/detail', {
    // product: rows,
  });
  // res.render('vwProducts/detail');

})



module.exports = router;