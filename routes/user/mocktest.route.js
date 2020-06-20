const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
const userModel = require('../../models/user.model');


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
  // console.log(row);

  timeLeft = 3600;
  timeStart = moment().unix();
  console.log("time start:", timeStart);
  res.render('vwMocktests/detailMocktest', {
    mocktest: row,
    empty: row === null,
    timeLeft,
    timeStart
  });
});


router.post('/ajax', async (req, res) => {

  item = req.body;
  console.log(item);
  const row = await mocktestModel.single(item._id);
  // console.log(row);

  authUser = req.session.authUser;

  mockTests = authUser.tests;
  oldTimeLeft = 3600;

  item.isExisted = false;
  if (mockTests.length > 0) {
    mockTests.every(mock => {
      if (mock._id == item._id) {

        item.isExisted = true;
        oldTimeLeft = mock.timeLeft;
        return false;
      }
    });
  }

  if (item.action == "save") {
    timeStart = parseInt(item.timeStart);
    timeNow = moment().unix();
    timeUsed = timeNow - timeStart;

    item.timeLeft = oldTimeLeft - timeUsed;

    item.status = 0; //1: DONE, 0: PENDING, -1:DELETED

    delete item.action;
    delete item.timeStart;

    if (item.isExisted == false) {
      authUser.tests.push(item);
    }
    else {

      authUser.tests = authUser.tests.map(obj => {
        if (obj._id === item._id)
          console.log("lala")
        return item
      });

      // console.log("TEMP: ", temp);

    }

    console.log("TESTS ajax:", authUser.tests);

    entity = {
      _id: authUser._id,
      tests: authUser.tests
    }
    // temp = await userModel.patchMocktest(entity)

    // console.log(temp);

    res.json({
      success: true,
      message: 'Lưu thành công',

    })
  }
  else {
    res.json({
      success: false,
      message: 'Không save được'
    });
  }


})





module.exports = router;