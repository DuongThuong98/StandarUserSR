const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const userModel = require('../../models/user.model');
const documentModel = require('../../models/document.model');
const courseModel = require('../../models/course.model');
const router = express.Router();


//Trang quản lý course
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


router.post('/add', async (req, res) => {
    // const seller = req.session.authUser;
    const entity = req.body;
    // entity.lecturer = seller._id;
    // console.log(entity.name);

    result = await courseModel.add(entity);
    console.log("Thêm được chưa?: ", result);
    // res.render('vwTeacher/addDoc');
    res.send({result: result})
})


module.exports = router;
