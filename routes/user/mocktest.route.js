const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
const userModel = require('../../models/user.model');
const helper = require('../../helpers/function.helper');

// const categoryModel = require('../models/category.model');

// const config = require('../config/default.json');

const router = express.Router();


router.get('/', async (req, res) => {
  authUser = req.session.authUser;
  let rows = authUser.tests;
  var mockTests = [];
  for (i = 0; i < rows.length; i++) {
    const temp = await mocktestModel.single(rows[i]._id);
    rows[i].name = temp.name;
    rows[i].mocktestType = temp.mocktestType;
    if (rows[i].status === 0) {
      rows[i].isDone = false;
    }
    else {
      rows[i].isDone = true;
    }

    if (temp != null) {
      console.log("la ");
      mockTests.push(rows[i]);
    }
  }


  console.log(rows)
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
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  const mockId = req.params.id;
  const row = await mocktestModel.single(mockId);
  // console.log(row);
  // console.log("lala")
  answerKeys = row.answerKeys;
  for (i = 0; i < answerKeys.length; i++) {
    if (typeof answerKeys[i].key == "string") {

    }
    else {
      //alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
      keyAlpha = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('', answerKeys[i].key.length);
      keyABC = []
      for (j = 0; j < answerKeys[i].key.length; j++) {
        temp = {
          alpha: keyAlpha[j],
          detail: answerKeys[i].key[j]
        }
        keyABC.push(temp)
      }

      answerKeys[i].keyABC = keyABC
      if (typeof answerKeys[i].keySub == "string") {
        answerKeys[i].single = true;
      }
      else {
        answerKeys[i].single = false;
      }
    }
    answerKeys[i].number = i + 1;
  }

  row.answerKeys = answerKeys;

  console.log(answerKeys)
  timeLeft = 3600;
  timeStart = moment().unix();
  console.log("time start:", timeStart);
  res.render('vwMocktests/detailMocktest', {
    mocktest: row,
    empty: row === null,
    amountQuiz: row.answerKeys.length,// số câu trong bài kiểm tra
    timeLeft,
    timeStart, 
    layout: false 
  });
});

router.get('/pending/:id', async (req, res) => {
  const mockId = req.params.id;
  const mocktest = await mocktestModel.single(mockId);

  console.log(mocktest);

  authUser = req.session.authUser;
  mockTests = authUser.tests;
  var pendingMock = {};
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi (ở đây là chắn chắn)
    index = mockTests.findIndex(mock => mock._id == mockId && mock.status == 0);
    if (index != -1) {
      pendingMock = mockTests[index]
    }
  }


  if (isEmpty(pendingMock)) {//mnếu là bài test CHƯA LÀM
    res.redirect("/");
  }
  else {
    timeLeft = pendingMock.timeLeft;
    timeStart = moment().unix();

    amountQuiz = parseInt(pendingMock.answerKeys.length)
    //tạo list câu trả lời mà có số
    answerKeys = pendingMock.answerKeys;
    mocktestData = mocktest.answerKeys;
console.log(mocktestData);
    for (i = 0; i < answerKeys.length; i++) {
      //câu dạng lý thuyết
      if (typeof mocktestData[i].key == "string") {

      }
      else {//câu dạng trắc nghiệm
        keyAlpha = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('', mocktestData[i].key.length);
        keyABC = []
        for (j = 0; j < mocktestData[i].key.length; j++) {
          temp = {
            alpha: keyAlpha[j],
            detail: mocktestData[i].key[j]
          }
          keyABC.push(temp)
        }

        answerKeys[i].keyABC = keyABC

        if (typeof mocktestData[i].keySub == "string") {
          answerKeys[i].single = true;
          for (z = 0; z < answerKeys[i].keyABC.length; z++) {
            if (answerKeys[i].keyABC[z].alpha == answerKeys[i].key) {
              answerKeys[i].keyABC[z].chose = true;
            }
          }
        }
        else {
          answerKeys[i].single = false;
          for (z = 0; z < answerKeys[i].keyABC.length; z++) {
            if (answerKeys[i].key.includes(answerKeys[i].keyABC[z].alpha)) {
              answerKeys[i].keyABC[z].chose = true;
            }
          }
        }

      }

      answerKeys[i].number = i + 1;
    }

    pendingMock.questionLink = mocktest.questionLink;
    pendingMock.audioLinks = mocktest.audioLinks;
    console.log("time start pending:", pendingMock);

    res.render('vwMocktests/pendingDetailMocktest', {
      mocktest: pendingMock,
      empty: pendingMock === null,
      amountQuiz: mocktest.answerKeys.length,// số câu trong bài kiểm tra
      timeLeft,
      timeStart,
      layout: false 
    });
  }


});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/done/:id', async (req, res) => {
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  const mockId = req.params.id;
  const mocktest = await mocktestModel.single(mockId);

  authUser = req.session.authUser;
  mockTests = authUser.tests;
  var doneMock = {};
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi
    index = mockTests.findIndex(mock => mock._id == mockId && mock.status == 1);
    if (index != -1) {
      doneMock = mockTests[index];
    }
  }

  if (isEmpty(doneMock)) {//mnếu là bài test CHƯA LÀM hoặc CHƯA LÀM XONG
    res.redirect("/");
  }
  else {
    amountQuiz = parseInt(doneMock.answerKeys.length)
    //tạo list câu trả lời mà có số
    answerKeys = doneMock.answerKeys;
    mocktestData = mocktest.answerKeys;

    for (i = 0; i < answerKeys.length; i++) {
      //câu dạng lý thuyết
      if (typeof mocktestData[i].key == "string") {
        //xét câu đó nếu đúng hay sai
        if (answerKeys[i].isRight == true) {

        }
        else {
          answerKeys[i].realKey = mocktestData[i].key
        }
      }
      else {//câu dạng trắc nghiệm

        keyAlpha = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('', mocktestData[i].key.length);
        keyABC = []
        for (j = 0; j < mocktestData[i].key.length; j++) {
          temp = {
            alpha: keyAlpha[j],
            detail: mocktestData[i].key[j]
          }
          keyABC.push(temp)
        }

        answerKeys[i].keyABC = keyABC

        if (typeof mocktestData[i].keySub == "string") {
          answerKeys[i].single = true;
          for (z = 0; z < answerKeys[i].keyABC.length; z++) {
            if (answerKeys[i].keyABC[z].alpha == answerKeys[i].key) {
              answerKeys[i].keyABC[z].chose = true;
            }
          }
        }
        else {
          answerKeys[i].single = false;

          for (z = 0; z < answerKeys[i].keyABC.length; z++) {

            if (answerKeys[i].key.includes(answerKeys[i].keyABC[z].alpha)) {
              answerKeys[i].keyABC[z].chose = true;
            }
          }
        }

        //xét câu đó nếu đúng hay sai
        if (answerKeys[i].isRight == true) {

        }
        else {
          answerKeys[i].realKey = mocktestData[i].keySub
        }
      }

      answerKeys[i].number = i + 1;
    }


    doneMock.questionLink = mocktest.questionLink;
    doneMock.audioLinks = mocktest.audioLinks;
    console.log("time start pending:", doneMock);


    //tính điẻm và đưa ra khóa học hợp lý
    doneMock.percentGrade = ((doneMock.grades / doneMock.answerKeys.length) * 100).toFixed(2);
    doneMock.answersLength = doneMock.answerKeys.length;

    res.render('vwMocktests/doneDetailMocktest', {
      mocktest: doneMock,
      empty: doneMock === null,
      layout: false 
    });
  }
});

router.get('/key/:id', async (req, res) => {
  const mockId = req.params.id;
  const row = await mocktestModel.single(mockId);

  return res.render('vwMocktests/keyMocktest', {
    layout: false,
    mocktest: row
  });

});

//ruote nộp bài
router.post('/submit', async (req, res) => {
  item = req.body;
  console.log(item);

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

  amountQuiz = parseInt(row.answerKeys.length)

  questionKey = row.answerKeys;

  answerKeys = [];

  for (i = 0; i < amountQuiz; i++) {
    keyBro = "answerKeys_" + String(i + 1);
    obj = {}
    //dạng điền lỗ
    if (typeof questionKey[i].key == "string") {
      if (helper.phraseIsAccepted(item[keyBro], questionKey[i].key)) {
        item.grades++;
        obj = {
          isRight: true,
          key: item[keyBro]
        }
      }
      else {
        //console.log("lalla",i);
        obj = {
          isRight: false,
          key: item[keyBro]
        }
      }
    }
    else {
      // dạng trắc nghiệm 1 đáp án
      if (typeof questionKey[i].keySub == "string") {
        if (item[keyBro] === questionKey[i].keySub) {
          item.grades++;
          obj = {
            isRight: true,
            key: item[keyBro]
          }
        }
        else {
          //console.log("lalla1",i);
          if (typeof item[keyBro] == "undefined") {
            //console.log("lala",i)
            obj = {
              isRight: false,
              key: ''
            }
          }
          else {
            obj = {
              isRight: false,
              key: item[keyBro]
            }
          }
        }
      }
      else {//trắc nghiệm nhiều đáp án
        // console.log(item[keyBro], "lala" ,questionKey[i].keySub)

        if (helper.isEqual(item[keyBro], questionKey[i].keySub)) {
          item.grades++;
          obj = {
            isRight: true,
            key: item[keyBro]
          }
        }
        else {
          if (typeof item[keyBro] == "undefined") {
            //console.log("lala",i)
            obj = {
              isRight: false,
              key: ''
            }
          }
          else {
            obj = {
              isRight: false,
              key: item[keyBro]
            }
          }
        }

      }
    }

    answerKeys.push(obj)
  }

  item.answerKeys = answerKeys;

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

  console.log("AnswerKey: ", answerKeys);

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
  timeLeft = req.body.timeLeft;
  const mocktest = await mocktestModel.single(item._id);
  console.log("Item: ", item);

  authUser = req.session.authUser;

  mockTests = authUser.tests;
 
  oldTimeLeft = 3600;

  tempMock = {};

  item.isExisted = false;
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi
    index = mockTests.findIndex(mock => mock._id == item._id && mock.status == 0);
    if (index != -1) {
      tempMock = mockTests[index];
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

    // console.log(temp);

    res.json({
      success: true,
      message: 'Lưu thành công',
    })
  }
  else {
    if (item.action == "changeTimeLeft") {
      
      item.timeLeft = timeLeft;

      item.status = 0; //1: DONE, 0: PENDING, -1:DELETED
     
      if (item.isExisted == false) {
        var data = [];
        var length = mocktest.answerKeys.length; // user defined length

        for (var i = 0; i < length; i++) {
          data.push({ key: "" });
        }
        item.answerKeys = data;
        authUser.tests.push(item);
      }
      else {
        item = tempMock;
        item.timeLeft = timeLeft;
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

      console.log("TEMP 1",temp);

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

router.post('/ajax/confirm', async (req, res) => {

  item = req.body;
  // console.log(item);
  const row = await mocktestModel.single(item._id);
  // console.log(row);

  authUser = req.session.authUser;
  mockTests = authUser.tests;


  item.isExisted = false;
  if (mockTests.length > 0) {//nếu có tồn tại bài đã làm rồi
    index = mockTests.findIndex(mock => mock._id == item._id);
    if (index != -1) {
      res.json({
        success: false,
        message: 'Làm lại'
      });
    }
    else {
      res.json({
        success: true,
        message: 'Lần đầu'
      });
    }
  }
  else {
    res.json({
      success: true,
      message: 'Lần đầu!'
    });
  }


})



module.exports = router;


// if (response.success == false) {
//   var r = confirm("Bạn muốn làm lại bài này?");
//   if (r == true) {
//     b = true;
//   } else {
//     b = false;
//   }
// }
// else {
//   b = true;
// }