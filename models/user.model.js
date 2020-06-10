const db = require("../scheme_model/index");
const bcrypt = require('bcryptjs');
module.exports = {
  all: async () => {
    result = [];
    await db.User.find()
      .then(data => result = data)
    if (result.length === 0)
      return null
    return result;
  },
  single: async id => {
    result = [];
    await db.User.find({ _id: id })
      .then(data => result = data)
    if (result.length === 0)
      return null
    return result;
  },

  singleByUsername: async (username) => {
    result = [];
    await db.User.find({ username: username })
      .then(data => result = data)
    console.log("MOdel User : ", result)
    if (result.length === 0)
      return null
    return result;
  },

  add: async entity => {
    const user = new db.User({
      username: entity.username,
      email: entity.email,
      passwordHash: bcrypt.hashSync(entity.password, 8),
      password: entity.password
    });

    const result = await user.save();
    console.log(result)
    if (!result) {
      console.log("data null");
      return null;
    }
    return result
  },
  // del: u_id => db.del('users', { id: u_id }),
  // patch: entity => {
  //   const condition = { id: entity.id };
  //   //delete entity.id;
  //   // console.log(condition, entity);
  //   return db.patch('users', entity, condition);
  // },
};
