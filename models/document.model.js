const db = require("../scheme_model/index");
// const Document = require("../scheme_model/document.model");
const config = require('../config/default.json');
module.exports = {

  countByCat:  async catId => {return await db.Document.find({categoryId:catId}).count()},
  pageByCat: async (catId, offset) =>{ temp = await db.Document.find({categoryId:catId})
                        .limit(config.paginate.limit)
                        .skip(offset)
                      console.log(temp);
                    return temp;}
                                        
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