const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
// const categoryModel = require('../models/category.model');

// const config = require('../config/default.json');

const router = express.Router();

router.get('/', async (req, res) => {
  const docId = req.params.id;
  const rows = await mocktestModel.all();
  console.log(rows);


  res.render('vwMocktests/mockList', {
    mocktests: rows,
    empty: rows.length === 0
  });



})



module.exports = router;