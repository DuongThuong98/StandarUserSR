const db = require("../scheme_model/index");

// const CourseRequest = require("../scheme_model/CourseRequest.model");
const config = require('../config/default.json');

module.exports = {

  findById: async (docId) =>{
    result = [];
   await db.Mailing.find({_id: docId})
          .then(data => result = data)
    return result;
  },

  findByToken: async (token) =>{
    result = {};
   await db.Mailing.findOne({token_email: token})
          .then(data => result = data)
    return result;
  },

  singleById: async (docId) =>{
    result = await db.Mailing.findOne({_id: docId});
    return result;
  },



  add: async (entity) => {
      const doc = new db.Mailing(entity)
      const result = await doc.save();
      if (result) {
        return result ;
    } else {
        return null;
    }
  }
  
  
};

