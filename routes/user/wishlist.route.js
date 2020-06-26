const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');


const userModel = require('../../models/user.model');

const router = express.Router();


router.get('/', async (req, res) => {
  res.render('vwUser/info');
});


//DANH SÁCH YÊU THÍCH
router.get('/wishlist', async (req, res) => {
  const products = [];
  // authUser = req.session.authUser;
  // let wishlist = await wishlistModel.allByUserID(authUser.id);
  // for (i = 0; i < wishlist.length; i++) {
  //   const pr = await productModel.single(wishlist[i].id_product);
  //   if (pr !== null) {
  //     products.push(pr[0]);
  //   }
  // }
  

  // console.log(wishlist);
  // console.log(products);
  res.render('vwUser/wishlist', {
    products,
    empty: products.length === 0,
  });
});

router.post('/ajax', async (req, res)=>{
  item = req.body;
  console.log(item);
  if (item.action == "add") {
    
    res.json({
      success: true,
      message: 'Lưu thành công',
    })
  }
});



module.exports = router;

