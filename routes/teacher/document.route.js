const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const userModel = require('../../models/user.model');
const documentModel = require('../../models/document.model');
const categoryModel = require('../../models/category.model');


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
        var fname = file.originalname.substr(0, file.originalname.indexOf(".")) + '-' + Date.now() + duoi;
        cb(null, fname);
    },
    destination: function (req, file, cb) {
        cb(null, `public/images/documents`);
    },
});
const upload = multer({ storage });

//const upload = multer({dest:'upload/'})


const router = express.Router();


//Trang quản lý document
router.get('/', async (req, res) => {
    const seller = req.session.authUser;
    const rows = await documentModel.allByIDTeacher(seller._id);

    // console.log(seller);
    console.log(rows);
    res.render('vwTeacher/indexDoc', {
        products: rows,
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
    console.log(req.body);
   
    const entity = req.body;
    entity.authorID = req.session.authUser._id;
    entity.image = req.files['fuMain'][0].filename;
    result = await documentModel.add(entity);
    
   
    // console.log(entity.name);
    console.log("Thêm được chưa?: ",result);
    res.render('vwTeacher/addDoc');
})

// router.get('/edit/:id', async (req, res) => {
//     const rows = await productModel.single(req.params.id);

//     if (rows.length === 0) {
//         throw new Error('Invalid product id');
//     }
//     const type = await categoryModel.single(rows[0].id_type);
//     //console.log(rows[0]);
//     //console.log(type);

//     res.render('vwSeller/editPro', { product: rows[0], typeName: type[0].cate_name });
// })


// router.post('/patch', async (req, res) => {
//     const rows = await productModel.single(req.body.id);

//     if (rows.length === 0) {
//         throw new Error('Invalid product id');
//     }
//     const type = await categoryModel.single(rows[0].id_type);
//     //console.log(rows[0]);
//     //console.log(type);

//     current_time = moment().format('LLLL'); 
//     rows[0].detail = "</br>" + rows[0].detail + '<b>'+current_time+'</b> </br>' +req.body.moreDetail ;

//     console.log(req.body);
//     console.log(rows[0].detail);
//     entity = {detail: rows[0].detail,
//               ProID: req.body.id};
//     productModel.patch(entity);
//     //res.render('vwSeller/editPro', { product: rows[0], typeName: type[0].cate_name });
//     res.redirect('/seller/product');
// })


module.exports = router;
