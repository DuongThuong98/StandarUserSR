const db = require("../scheme_model/index");

module.exports = {
  cap1: async() => {
    const data = await db.Category.find({level: "0"});

    return data;
  },
  cap2: async () => {
    var mangBu = [];
    const rows = await db.Category.find({level: "0"});
    for (i = 0; i < rows.length; i++) {
     
      const row2 = await db.Category.find({level: rows[i]._id});

      var mangCap2 = [];
      for (n = 0; n < row2.length; n++) {
        mangCap2.push({
          cap2_id: row2[n]._id,
          cap2_name: row2[n].name
        });
      }
      var item = {
        cap1: rows[i],
        mangcap2: mangCap2
      };
      mangBu.push(item);
    }
    return mangBu;
  },
 
  isLevelOne: async (catId)=>{
    const data = await db.Category.find({_id: catId,level: "0"});
    if(data.length>0) return true;
    return false;
  },

  haveChildren: async (catId)=>{
    const data = await db.Category.find({level: catId});
    // console.log(data)
    if(data.length>0) return true;
    return false;
  },

  takeChildren:async (catId) => {
    const data = await db.Category.find({level: catId});
    return data;
  }




};
