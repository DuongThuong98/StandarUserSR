const db = require("../scheme_model/index");

module.exports = {
  cap1: async() => {
    const data = await db.Category.find({level: "0"});

    return data;
  },

};
