const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
// const userModel = require('../../models/user.model');

const router = express.Router();

//INFO
router.get('/', async (req, res) => {
  res.render('vwUser/info');
});

router.get('/info', async (req, res) => {
  authUser = req.session.authUser;
  res.render('vwUser/info', { authUser });
});


//DANH SÁCH ĐÁNH GIÁ



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
  // if (typeof (req.session.wishlistLength) === 'undefined') {
  //   req.session.wishlistLength = wishlist.length;
  // }

  // console.log(wishlist);
  // console.log(products);
  res.render('vwUser/wishlist', {
    products,
    empty: products.length === 0,
  });
});




module.exports = router;

