const db = require("../scheme_model/index");
const categoryModel = require('../models/category.model');
// const Course = require("../scheme_model/Course.model");
const config = require('../config/default.json');

module.exports = {

  all: async () =>{
    result = await db.Course.find()
   console.log(result);
    return result;
  },

  allByIDTeacher: async (id) =>{
    result = await db.Course.find({ authorID: id })
   console.log(result);
    return result;
  },

  findById: async (docId) =>{
    result = [];
   await db.Course.find({_id: docId})
          .then(data => result = data)
    return result;
  },

  singleById: async (docId) =>{
    result = await db.Course.findOne({_id: docId});
    return result;
  },

  singleByCategory : async (cate) =>{
    result = await db.Course.findOne({category: cate});
    return result;
  },
  
  singleByName:async (anyName) =>{
    anyNameFind = ".*" + anyName +".*";
    result = await db.Course.findOne({"name" : {$regex : anyNameFind}});
  //  console.log(result);
    return result;
  },

  

  add: async (entity) => {
      const doc = new db.Course(entity)
      const result = await doc.save();
      if (result) {
        return result ;
    } else {
        return null;
    }
  }
  
  
};

