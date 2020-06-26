const db = require("../scheme_model/index");
const categoryModel = require('../models/category.model');
// const Document = require("../scheme_model/document.model");
const config = require('../config/default.json');

module.exports = {

  countByCat: async catId => {
    result = [];
    isLevelOne = await categoryModel.isLevelOne(catId);
    haveChildren =  await categoryModel.haveChildren(catId);

    if (!isLevelOne|| (isLevelOne && !haveChildren)) {
      await db.Document.find({ categoryId: catId }).then(data => result = data)
     
    }
    else{//là cấp 1 nhưng có thêm con
      cateChildren = await categoryModel.takeChildren(catId);
      temp = [];
      cateChildren.forEach(child => {
        temp.push(child._id)
      });
      await db.Document.find({ categoryId: { $in: temp } }).then(data => result = data)
    }
    // console.log(result);
    return result.length;
    // return await db.Document.find({ categoryId: catId }).countDocuments()
   },
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

  findById: async (docId) =>{
    result = [];
   await db.Document.find({_id: docId})
          .then(data => result = data)
    return result;
  },

  singleById: async (docId) =>{
    result = await db.Document.findOne({_id: docId});
    return result;
  },

  upDateView: async (_id) =>{
   doc = null;
   await db.Document.findOne({_id})
          .then(data => doc = data)
    // console.log(doc)
    if(doc!=null)
    {
      const result = await db.Document.findOneAndUpdate({ _id }, { views: ++doc.views} )
      if (result) {
        const data = await db.Document({ _id: result._id })
        if (data) {
          return true;
        }
        else
        return false;
      }
    }
    else{
      return false;
    }
    // return false;
  },
  countBySearch: async (searchKey,categoryId) => {
    result = [];
 
    await db.Document.find({ $text: { $search: searchKey } }).then(data => result = data)
   
    return result.length;
    // return await db.Document.find({ categoryId: catId }).countDocuments()
   },

  pageBySearch: async (searchKey,categoryId ,offset) => {
    result = [];

      await db.Document.find({ $text: { $search: searchKey } })
    .limit(config.paginate.limit)
    .skip(offset).then(data => result = data)

    return result;
  },


  allByIDTeacher: async (id) =>{
    result = await db.Document.find({ authorID: id })
   console.log(result);
    return result;
  },

  add: async (entity) => {
      const doc = new db.Document(entity)
      const result = await doc.save();
      if (result) {
        return result ;
    } else {
        return null;
    }
  }
  
  
};

