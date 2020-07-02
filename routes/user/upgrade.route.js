const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
const userModel = require('../../models/user.model');
const { model } = require('../../scheme_model/user.model');
const helper = require('../../helpers/function.helper');

const router = express.Router();


router.get('/', async (req, res) => {

  rows = await mocktestModel.singleByName("PRE");
  console.log(rows)
  res.render('vwUser/upgrade', {
    mocktests: rows,
    // empty: rows.length === 0
  });

});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/mocktest/done/:id', async (req, res) => {
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
    pendingMock.audioLinks = row.audioLinks;
    console.log("time start pending:", pendingMock);
    // console.log("time start pending:", pendingMock);

    pendingMock.percentGrade = (pendingMock.grades / pendingMock.answerKeys.length)*100  ;
    suggestedCourse = {}
    if(pendingMock.percentGrade > 10)
    {
      suggestedCourse = {_id: "5ef8c255c6266fb21c016c6c"}
    }
    res.render('vwMocktests/upgradeDoneDetailMocktest', {
      mocktest: pendingMock,
      empty: pendingMock === null,
      numberedAnswers,
      suggestedCourse
    });
  }
});

router.get('/mocktest/:id', async (req, res) => {
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
  res.render('vwMocktests/upgradeDetailMocktest', {
    mocktest: row,
    empty: row === null,
    timeLeft,
    timeStart
  });
});

router.post('/mocktest/submit', async (req, res) => {
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
    if (typeof questionKey[i].key == "string") {
      if (item[keyBro] === questionKey[i].key) {
        item.grades++;
        obj = {
          isRight: true,
          key: item[keyBro]
        }
      }
      else
        obj = {
          isRight: false,
          key: item[keyBro]
        }
    }
    else {
      if (typeof questionKey[i].keySub == "string") {
        if (item[keyBro] === questionKey[i].keySub) {
          item.grades++;
          obj = {
            isRight: true,
            key: item[keyBro]
          }
        }
        else
          obj = {
            isRight: false,
            key: item[keyBro]
          }
      }
      else {
        // console.log(item[keyBro], "lala" ,questionKey[i].keySub)

        if (helper.isEqual(item[keyBro], questionKey[i].keySub)) {
          item.grades++;
          obj = {
            isRight: true,
            key: item[keyBro]
          }
        }
        else
          obj = {
            isRight: false,
            key: item[keyBro]
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

  res.redirect(`/user/upgrade/mocktest/done/${item._id}`)
 
});



module.exports = router;


