const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const userModel = require('../../models/user.model');
const documentModel = require('../../models/document.model');
const mocktestModel = require('../../models/mocktest.model');
const categoryModel = require('../../models/category.model');


// const storage = multer.diskStorage({
//     filename: function (req, file, cb) {
//         var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
//         var fname = file.originalname.substr(0, file.originalname.indexOf(".")) + '-' + Date.now() + duoi;
//         cb(null, fname);
//     },
//     destination: function (req, file, cb) {
//         var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
//         if (duoi == ".mp3") {
//             cb(null, `public/mp3/documents`);
//         }
//         else {
//             if (duoi == ".pdf") {
//                 cb(null, `public/pdf/documents`);
//             }
//             else {
//                 cb(null, `public/images/documents`);
//             }
//         }
//     },
// });
// const upload = multer({ storage });

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
  })

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
      },
      key: (req, file, cb) => {

        var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
        if (duoi == ".mp3") {
            cb(null, 'mp3_files/' + Date.now().toString() + "-" + file.originalname);
        }
        else {
            if (duoi == ".pdf") {
                cb(null, 'pdf_files/' + Date.now().toString() + "-"  + file.originalname);
            }
            else {
                cb(null, 'images_files/' + Date.now().toString() + "-"  + file.originalname);
            }
        }
      }
    })
  })


//const upload = multer({dest:'upload/'})

const router = express.Router();


//Trang quản lý document
router.get('/', async (req, res) => {
    const seller = req.session.authUser;
    const rows = await mocktestModel.allByIDTeacher(seller._id);

    // console.log(seller);
    console.log(rows);
    res.render('vwTeacher/indexDoc', {
        mocktests: rows,
        empty: rows.length === 0
    });
});

router.get('/add', (req, res) => {
    res.render('vwTeacher/addDoc');
})

var cpUpload = upload.fields([{ name: 'fuMain', maxCount: 1 },
{ name: 'fuMain-ques', maxCount: 1 },
{ name: 'fuMain-key', maxCount: 1 },
{ name: 'fuMain-audio', maxCount: 5 }
])

router.post('/add', cpUpload, async (req, res) => {
    if (typeof (req.body.categoryId) == "undefined") {
        const entity = req.body;
        console.log(entity);
        console.log(req.files)
        entity.questionLink = req.files['fuMain-ques'][0].key;
        entity.answerKeyLink = req.files['fuMain-key'][0].key;

        if (entity.mocktest_type == 1) {
            entity.audioLinks = [];
            req.files['fuMain-audio'].forEach(element => {
                entity.audioLinks.push(element.key)
            });
            entity.mocktestType = "listening";
        }
        else{
            entity.mocktestType = "reading";
        }

        delete entity.mocktest_type;
        entity.authorID = req.session.authUser._id;

        amountQuiz = parseInt(entity.points)

        answerKeys = [];

        temp = "answerKeys_1";
        console.log(entity[temp]);
        
        for(i=0;i<amountQuiz;i++)
        {
            keyBro = "answerKeys_"+ String(i+1);
            obj = {}
            if(typeof entity[keyBro] == "string")
            {
                obj = {key: entity[keyBro]}
            }
            else
            {
                keySub = keyBro + "_sub"
                obj = {key: entity[keyBro],
                keySub: entity[keySub]}
            }
            
            answerKeys.push(obj)
        }
        
        entity.answerKeys = answerKeys;
        console.log(entity.answerKeys)
        answerKeys.forEach(element => {
            console.log(element);
            
        });

        result = await mocktestModel.add(entity);
        console.log("Thêm được chưa?: ", result);
    }
    else {
        const entity = req.body;
        entity.authorID = req.session.authUser._id;
        entity.image = req.files['fuMain'][0].key;

         result = await documentModel.add(entity);
        console.log("Thêm được chưa?: ", entity);
    }
    // console.log(entity.name);

    res.render('vwTeacher/addDoc');
})


module.exports = router;

// for (var i = 1; i <= rows; i++) {
//     if (i % 4 == 1) {
//         $('.answers-input').append(" <li class='row'>");
//     }

//     $('.answers-input').append("<div class='col-sm-3'>"
//         + i + ".<input type='text' class='input form-control' name='answerKeys'" +
//         "id = 'answer-key' ></div > ");

//     if (i % 4 == 1) {
//         $('.answers-input').append('</li>');
//     }

// }


// jQuery(document).ready(function () {
//     $('.choices').click(function () {
//         var temp = $(this).attr('choice-id')
//         console.log("temp")
//         code = ".points-singleQuiz-" + temp;
//         console.log(code)
//         if ($(this).is(":checked")) {
//             $(code).show(500)
//             //$('.singleQuiz').empty();

//         }
//         else {
//             $(code).hide(500)
//             //$('.singleQuiz').empty();
//            // $('.singleQuiz').append(` <input type="text" class="input form-control"
//             //                                                        name="answerKeys" id="answer-key">`)
//         }
//     })
// });

// jQuery(document).on('click','.choices',function () {
      
//     var temp = $(this).attr('choice-id')
//     console.log("temp")
//     code = ".points-singleQuiz-" + temp;
//     console.log(code)
  

// });