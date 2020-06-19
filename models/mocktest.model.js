const db = require("../scheme_model/index");
const categoryModel = require('../models/category.model');
// const Document = require("../scheme_model/document.model");
const config = require('../config/default.json');

module.exports = {

  pageByCat: async (catId, offset, arrange) => {
    result = [];
  
    isLevelOne = await categoryModel.isLevelOne(catId);
    haveChildren =  await categoryModel.haveChildren(catId);
    // console.log(isLevelOne)
    // console.log(haveChildren)
    console.log("arr:",arrange)
    switch (+arrange) {
      case 0:
        {
          if (!isLevelOne||
            (isLevelOne && !haveChildren)) {
            await db.Document.find({ categoryId: catId })
              .limit(config.paginate.limit)
              .skip(offset).then(data => result = data)
              // console.log("test: ",result);
          }
          else{//là cấp 1 nhưng có thêm con
            cateChildren = await categoryModel.takeChildren(catId);
            temp = [];
            cateChildren.forEach(child => {
              temp.push(child._id)
            });
            await db.Document.find({ categoryId: { $in: temp } })
              .limit(config.paginate.limit)
              .skip(offset).then(data => result = data)
            console.log("test: ",result);
          }
        }
        break;
      case 1:
          console.log("case1")
          if (!isLevelOne||
            (isLevelOne && !haveChildren)) {
            await db.Document.find({ categoryId: catId }).sort({createdAt: -1})
              .limit(config.paginate.limit)
              .skip(offset).then(data => result = data)
              // console.log("test: ",result);
          }
          else{//là cấp 1 nhưng có thêm con
            cateChildren = await categoryModel.takeChildren(catId);
            temp = [];
            cateChildren.forEach(child => {
              temp.push(child._id)
            });
            await db.Document.find({ categoryId: { $in: temp } }).sort({createdAt: -1})
              .limit(config.paginate.limit)
              .skip(offset)
              .then(data => result = data)
            console.log("test: ",result);
          }
        
        break;
      case 2:{
        {
          if (!isLevelOne||
            (isLevelOne && !haveChildren)) {
            await db.Document.find({ categoryId: catId }).sort({views: 1})
              .limit(config.paginate.limit)
              .skip(offset).then(data => result = data)
              // console.log("test: ",result);
          }
          else{//là cấp 1 nhưng có thêm con
            cateChildren = await categoryModel.takeChildren(catId);
            temp = [];
            cateChildren.forEach(child => {
              temp.push(child._id)
            });
            await db.Document.find({ categoryId: { $in: temp } }).sort({views: 1})
              .limit(config.paginate.limit)
              .skip(offset).then(data => result = data)
            console.log("test: ",result);
          }
        }
      }
        break
      default:
        // console.log("case1")
        break;
    }
   

    // console.log(result);
    return result;
  },

  allByIDTeacher: async (id) =>{
    result = await db.MockingTest.find({ authorID: id })
   console.log(result);
    return result;
  },

  all: async () =>{
    result = await db.MockingTest.find()
   console.log(result);
    return result;
  },

  add: async (entity) => {
      const doc = new db.MockingTest(entity)
      const result = await doc.save();
      if (result) {
        return result ;
    } else {
        return null;
    }
  }
  
  
};

