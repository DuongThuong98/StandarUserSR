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
  patch: async entity => {
    const { _id, username, email, passwordHash } = entity
    const user = await db.User.findOne({ _id })
    if (user) {
        const result = await db.User.findOneAndUpdate({ _id }, 
                              { username: username || user.username,
                                email: email || user.email,
                                passwordHash: passwordHash || user.passwordHash,
                                                                    })
        if (result) {
            const data = await db.User.findOne({ _id: result._id })
            if (data) {
                return data;
            }
            else{
              return null;
            }
        }
    }
    return null;
  },
};
