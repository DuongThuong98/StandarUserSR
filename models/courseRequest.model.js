const db = require("../scheme_model/index");
const categoryModel = require('../models/category.model');
// const CourseRequest = require("../scheme_model/CourseRequest.model");
const config = require('../config/default.json');

module.exports = {


  findById: async (docId) =>{
    result = [];
   await db.CourseRequest.find({_id: docId})
          .then(data => result = data)
    return result;
  },

  singleById: async (docId) =>{
    result = await db.CourseRequest.findOne({_id: docId});
    return result;
  },

  allByIDTeacher: async (id) =>{
    result = await db.CourseRequest.find({ authorID: id })
   console.log(result);
    return result;
  },

  add: async (entity) => {
      const doc = new db.CourseRequest(entity)
      const result = await doc.save();
      if (result) {
        return result ;
    } else {
        return null;
    }
  }
  
  
};

