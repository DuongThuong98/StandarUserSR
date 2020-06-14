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
  }

};

// exports.findAll = async(req, res) => {
//   try {
//       let { limit, offset } = req.params;

//       limit = parseInt(limit);
//       offset = parseInt(offset);
//       const length = await db.Document.find().countDocuments();

//       const data = await db.Document.find()
//           .limit(limit)
//           .skip((offset - 1) * limit);
//       return res.status(200).json({ data, length });

//   } catch (err) {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving documents.",
//       });
//   }
// };

// exports.findAllNoPaging = async(req, res) => {
//   try {
//       db.Document.find()
//           .then((documents) => {
//               res.status(200).json(documents);
//           });
//   } catch (err) {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving documents.",
//       });
//   }
// };

// exports.findById = async(req, res) => {
//   try {
//       db.Document.findById(req.params.id)
//           .then((document) => {
//               if (!document) {
//                   return res.status(404).send({
//                       message: "Document not found with id " + req.params.id,
//                   });
//               }
//               res.json(document);
//           })
//   } catch (err) {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving documents.",
//       });
//   }
// };

// exports.create = async(req, res) => {
//   try {
//       db.Document.create(req.body, function(err, document) {
//           if (err) {
//               res.send("error saving document");
//           } else {
//               res.send(document);
//           }
//       });
//   } catch (err) {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving documents.",
//       });
//   }
// };

// exports.update = async(req, res) => {
//   try {
//       db.Document.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
//           .then(document => {
//               if (!document) {
//                   return res.status(404).send({
//                       message: "Note not found with id " + req.params.id
//                   });
//               }
//               res.send(document);
//           })
//   } catch (err) {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving documents.",
//       });
//   }
// };

// exports.delete = async(req, res) => {
//   try {
//       db.Document.findOneAndRemove({
//               _id: req.params.id,
//           },
//           function(err, document) {
//               if (err) {
//                   res.send("error removing");
//               } else {
//                   res.send({ message: "Document deleted successfully!" });
//               }
//           }
//       );
//   } catch (err) {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving documents.",
//       });
//   }
// };