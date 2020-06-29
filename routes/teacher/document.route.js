const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const userModel = require('../../models/user.model');
const documentModel = require('../../models/document.model');
const mocktestModel = require('../../models/mocktest.model');
const categoryModel = require('../../models/category.model');


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
        var fname = file.originalname.substr(0, file.originalname.indexOf(".")) + '-' + Date.now() + duoi;
        cb(null, fname);
    },
    destination: function (req, file, cb) {
        var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
        if (duoi == ".mp3") {
            cb(null, `public/mp3/documents`);
        }
        else {
            if (duoi == ".pdf") {
                cb(null, `public/pdf/documents`);
            }
            else {
                cb(null, `public/images/documents`);
            }
        }
    },
});
const upload = multer({ storage });

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
        entity.questionLink = req.files['fuMain-ques'][0].filename;
        entity.answerKeyLink = req.files['fuMain-key'][0].filename;

        if (entity.mocktest_type == 1) {
            entity.audioLinks = [];
            req.files['fuMain-audio'].forEach(element => {
                entity.audioLinks.push(element.filename)

            });
            entity.mocktestType = "listening";
        }
        else{
            entity.mocktestType = "reading";
        }

        delete entity.mocktest_type;
        entity.authorID = req.session.authUser._id;
        console.log(entity)

        result = await mocktestModel.add(entity);
        console.log("Thêm được chưa?: ", result);
    }
    else {
        const entity = req.body;
        entity.authorID = req.session.authUser._id;
        entity.image = req.files['fuMain'][0].filename;

        // result = await documentModel.add(entity);
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