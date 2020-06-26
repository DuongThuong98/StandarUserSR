const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
const userModel = require('../../models/user.model');


// const categoryModel = require('../models/category.model');

// const config = require('../config/default.json');

const router = express.Router();


router.get('/', async (req, res) => {
  authUser = req.session.authUser;
  let rows = authUser.tests;
  mockTests = [];
  rows.forEach(async row => {
    const temp = await mocktestModel.single(row._id);
    row.name = temp.name;
    row.mocktestType = temp.mocktestType;
    if(temp.status == 0)
    {
      row.isDone = false;
    }
    else{
      row.isDone = true;
    }
    if (temp != null) {
      mockTests.push(row);
    }
  });

  res.render('vwUser/mocklist', {
    mocktests: rows,
    empty: rows.length === 0
  });

});

router.get('/data', async (req, res) => {
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
  // console.log("lala")

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

router.get('/pending/:id', async (req, res) => {
  const mockId = req.params.id;
  const row = await mocktestModel.single(mockId);

  console.log(mockId);

  authUser = req.session.authUser;
  mockTests = authUser.tests;
  var pendingMock = {};
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi (ở đây là chắn chắn)
    index = mockTests.findIndex(mock => mock._id == mockId && mock.status == 0);
    if (index != -1) {
      pendingMock = mockTests[index]
    }
  }

  if (isEmpty(pendingMock)) {//mnếu là bài test CHƯA LÀM hoặc CHƯA LÀM XONG
    res.redirect("/");
  }
  else {
    timeLeft = pendingMock.timeLeft;
    timeStart = moment().unix();

    //tạo list câu trả lời mà có số
    numberedAnswers = [];
    for (i = 0; i < 40; i++) {
      temp = {
        index: i + 1,
        answer: pendingMock.answerKeys[i]
      };
      numberedAnswers.push(temp);
    }
    console.log(numberedAnswers)

    pendingMock.questionLink = row.questionLink;
    console.log("time start pending:", pendingMock);
    // console.log("time start pending:", pendingMock);
    res.render('vwMocktests/pendingDetailMocktest', {
      mocktest: pendingMock,
      empty: pendingMock === null,
      timeLeft,
      timeStart,
      numberedAnswers,
    });
  }
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/done/:id', async (req, res) => {
  const mockId = req.params.id;
  const row = await mocktestModel.single(mockId);

  authUser = req.session.authUser;
  mockTests = authUser.tests;
  var pendingMock = {};
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi
    index = mockTests.findIndex(mock => mock._id == mockId && mock.status == 1);
    if (index != -1) {
      pendingMock = mockTests[index];

    }

  }

  if (isEmpty(pendingMock)) {//mnếu là bài test CHƯA LÀM hoặc CHƯA LÀM XONG
    res.redirect("/");
  }
  else {
    //tạo list câu trả lời mà có số
    numberedAnswers = [];
    for (i = 0; i < 40; i++) {
      temp = {
        index: i + 1,
        answer: pendingMock.answerKeys[i]
      };
      numberedAnswers.push(temp);
    }
    console.log(numberedAnswers)

    pendingMock.questionLink = row.questionLink;
    console.log("time start pending:", pendingMock);
    // console.log("time start pending:", pendingMock);
    res.render('vwMocktests/doneDetailMocktest', {
      mocktest: pendingMock,
      empty: pendingMock === null,
      numberedAnswers,
    });
  }
});

router.get('/key/:id', async (req, res) => {
  const mockId = req.params.id;
  const row = await mocktestModel.single(mockId);

  return res.render('vwMocktests/keyMocktest', {
    layout: false,
    mocktest : row
  });

});

//ruote nộp bài
router.post('/submit', async (req, res) => {
  item = req.body;
  const row = await mocktestModel.single(item._id);

  authUser = req.session.authUser;
  mockTests = authUser.tests;

  timeStart = parseInt(item.timeStart);
  oldTimeLeft = 3600; //mặc định 

  item.grades = 0; //mặc định 
  item.isExisted = false;
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi thì lấy bài đó
    index = mockTests.findIndex(mock => mock._id == item._id && mock.status == 0);
    if (index != -1) {

      item.isExisted = true;
      oldTimeLeft = mockTests[index].timeLeft;
    }

  }


  timeNow = moment().unix();
  timeUsed = timeNow - timeStart;
  item.timeLeft = oldTimeLeft - timeUsed;

  item.status = 1; //1: DONE, 0: PENDING, -1:DELETED

  console.log("Item submited: ", item);
  for (i = 0; i < 40; i++) {
    if (item.answerKeys[i] == row.answerKeys[i]) {
      item.grades++;
    }
  }

  delete item.action;
  delete item.timeStart;

  if (item.isExisted == false) {
    authUser.tests.push(item);
  }
  else {
    authUser.tests = authUser.tests.map(obj => {
      if (obj._id === item._id)
        return item;
      return obj
    });
    // console.log("TEMP: ", temp);
  }

  console.log("TESTS ajax:", authUser.tests);

  entity = {
    _id: authUser._id,
    tests: authUser.tests
  }

  temp = await userModel.patchMocktest(entity)

  res.redirect(`/user/mocktest/done/${item._id}`)
  // res.render('vwMocktests/doneDetailMocktest', {
  //   mocktest: item,
  //   empty: item === null,
  //   numberedAnswers,
  // });

});


router.post('/ajax', async (req, res) => {

  item = req.body;
  // console.log(item);
  const row = await mocktestModel.single(item._id);
  // console.log(row);

  authUser = req.session.authUser;

  mockTests = authUser.tests;
  oldTimeLeft = 3600;

  item.isExisted = false;
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi
    index = mockTests.findIndex(mock => mock._id == item._id && mock.status == 0);
    if (index != -1) {

      item.grades = mockTests[index].grades;
      item.isExisted = true;
      oldTimeLeft = mockTests[index].timeLeft;
    }

  }

  if (item.action == "save") {
    timeStart = parseInt(item.timeStart);
    timeNow = moment().unix();
    timeUsed = timeNow - timeStart;

    item.timeLeft = oldTimeLeft - timeUsed;

    item.status = 0; //1: DONE, 0: PENDING, -1:DELETED

    delete item.action;
    delete item.timeStart;
    console.log("Item", item);
    if (item.isExisted == false) {
      authUser.tests.push(item);
    }
    else {
      authUser.tests = authUser.tests.map(obj => {
        if (obj._id === item._id)
          return item
        return obj;
      });

      // console.log("TEMP: ", temp);

    }

    console.log("TESTS ajax:", authUser.tests);

    entity = {
      _id: authUser._id,
      tests: authUser.tests
    }
    temp = await userModel.patchMocktest(entity)

    console.log(temp);

    res.json({
      success: true,
      message: 'Lưu thành công',
    })
  }
  else {

    if (item.action == "changeTimeLeft") {
      item.timeLeft

      item.status = 0; //1: DONE, 0: PENDING, -1:DELETED

      delete item.action;

      // console.log("Item",item);
      if (item.isExisted == false) {
        authUser.tests.push(item);
      }
      else {
        authUser.tests = authUser.tests.map(obj => {
          if (obj._id === item._id)
            return item
          return obj;
        });
        // console.log("TEMP: ", temp);
      }

      // console.log("TESTS ajax:", authUser.tests);

      entity = {
        _id: authUser._id,
        tests: authUser.tests
      }
      temp = await userModel.patchMocktest(entity)

      // console.log(temp);

      res.json({
        success: true,
        message: 'Lưu thành công',
      })
    }
    else
      res.json({
        success: false,
        message: 'Không save được'
      });
  }
})



module.exports = router;