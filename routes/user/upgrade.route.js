const express = require('express');
const moment = require('moment');
const mocktestModel = require('../../models/mocktest.model');
const userModel = require('../../models/user.model');
const courseModel = require('../../models/course.model');

const helper = require('../../helpers/function.helper');

const router = express.Router();


router.get('/', async (req, res) => {

  enryTest = await mocktestModel.singleByName("PRE");
  enryTestForTheExperienced = await mocktestModel.singleByName("ENTRY-LIS");
  console.log(enryTestForTheExperienced)

  authUser = req.session.authUser;
  mockTests = authUser.tests;
  //if already did an entry test
  myEntryTest = {};
  if (mockTests.length > 0) {
    myEntryTest = mockTests[0];
    myEntryTest.percentGrade = ((myEntryTest.grades / myEntryTest.answerKeys.length) * 100).toFixed(3);
  
    myEntryTest.answersLength = myEntryTest.answerKeys.length;
  }

  res.render('vwUser/upgrade', {
    enryTest: enryTest,
    enryTestForTheExperienced,
    myEntryTest: myEntryTest,
    empty: mockTests.length === 0
  });

});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/mocktest/done/:id', async (req, res) => {
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
            //chữa cháy lúc demo cho Thầy bị lỗi
            if (typeof answerKeys[i].key == "undefined") {
              answerKeys[i].keyABC[z].chose = false;

            }
            else {
              if (answerKeys[i].key.includes(answerKeys[i].keyABC[z].alpha)) {
                answerKeys[i].keyABC[z].chose = true;
              }
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
    // console.log("time start pending:", doneMock);
    // console.log("Key ABC:", doneMock.answerKeys[24].keyABC);

    //tính điẻm và đưa ra khóa học hợp lý

    doneMock.percentGrade = ( (doneMock.grades / doneMock.answerKeys.length) * 100).toFixed(2);
    doneMock.answersLength = doneMock.answerKeys.length;
    suggestedCourse = {}
    console.log("Mocktest: ", mocktest)
    if (mocktest.name.includes("PRE")) {
      // console.log("PRE")
      if (doneMock.percentGrade < 70) {
        suggestedCourse = await courseModel.singleByName("[Beginner]")
      }
      else
      {
        if (doneMock.percentGrade >= 70 && doneMock.percentGrade <= 89) {
          suggestedCourse = await courseModel.singleByName("[5.0]")
        }
        else
        {
          if (doneMock.percentGrade >= 90) {
            suggestedCourse = await courseModel.singleByName("[5.0]")
          }
        }
      }
    }
    else {
      if (mocktest.name.includes("ENTRY")) {
        console.log("qwerty: ", doneMock.percentGrade)
        if (doneMock.percentGrade < parseFloat(30)) {
          suggestedCourse = await courseModel.singleByName("[Beginner]")
        }
        if (doneMock.percentGrade > parseFloat(30) && doneMock.percentGrade < parseFloat(50)) {
          console.log("qwerty: ", doneMock.percentGrade)
          suggestedCourse = await courseModel.singleByName("[5.0]")
        }
        if (doneMock.percentGrade >= parseFloat(50) && doneMock.percentGrade < parseFloat(60)) {
          console.log("6.0");
          suggestedCourse = await courseModel.singleByName("[6.0]")
        }
        if (doneMock.percentGrade >= parseFloat(60) && doneMock.percentGrade < parseFloat(70)) {
          console.log("7.0");
          suggestedCourse = await courseModel.singleByName("[7.0]")
        }
        if (doneMock.percentGrade >= 70) {
          suggestedCourse = await courseModel.singleByName("[Intensive]")
        }
      }
    }

    // console.log(suggestedCourse)

    res.render('vwMocktests/upgradeDoneDetailMocktest', {
      mocktest: doneMock,
      empty: doneMock === null,
      suggestedCourse
    });
  }
});

router.get('/mocktest/:id', async (req, res) => {
  //nếu tồn tại thì xóa
  authUser = req.session.authUser;

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
    
      item.isExisted = true;
    
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
      else
        obj = {
          isRight: false,
          key: item[keyBro]
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
        else
          {
            if(typeof item[keyBro] == "undefined")
          {
            //console.log("lala",i)
            obj = {
              isRight: false,
              key: ''
            }
          }
          else
          {
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
    authUser.tests[0] = item;
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


