const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');


const userModel = require('../../models/user.model');
const documentModel = require('../../models/document.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const interestedItems = [];
  authUser = req.session.authUser;
  let wishlist = authUser.interestedItems;
  
  for (i = 0; i < wishlist.length; i++) {
    const row = await documentModel.singleById(wishlist[i]._id);
  // console.log(row);
    if (row !== null) {
      interestedItems.push(row);
    }
  }
  

  console.log(interestedItems);
  // console.log(products);
  res.render('vwUser/wishlist', {
    interestedItems,
    empty: interestedItems.length === 0,
  });
});


router.post('/ajax', async (req, res)=>{
  item = req.body;
  
  authUser = req.session.authUser;
  wishList = authUser.interestedItems;
  index = -1;

  if (item.action == "add") {
    if (wishList.length > 0) {//nếu có tồn tại bài đã làm rồi
      index = wishList.findIndex(mock => mock._id == item._id  );
    }
    console.log("Item",item);

    if (index != -1) {
      res.json({
        success: false,
        message: 'Đã có trong danh sách yêu thích',
      })
    }
    else {
      authUser.interestedItems.push(item);

      // console.log("TEMP: ", temp);
      console.log("Intersted Items", authUser.interestedItems);

    entity = {
      _id: authUser._id,
      interestedItems: authUser.interestedItems
    }
    temp = await userModel.patchInterestedItems(entity)

    console.log(entity);

    res.json({
      success: true,
      message: 'Lưu thành công',
    })
    }
    
  }

});



module.exports = router;

