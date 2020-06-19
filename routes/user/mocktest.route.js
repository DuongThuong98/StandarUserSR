const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
// const categoryModel = require('../models/category.model');

// const config = require('../config/default.json');

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await mocktestModel.all();
  console.log(rows);


  res.render('vwMocktests/mockList', {
    mocktests: rows,
    empty: rows.length === 0
  });



});

router.get('/:id', async (req, res) => {
  const mockId = req.params.id;
  const row = await mocktestModel.single(mockId);
  console.log(row);


  res.render('vwMocktests/detailMocktest', {
    mocktest: row,
    empty: row === null
  });



})





module.exports = router;