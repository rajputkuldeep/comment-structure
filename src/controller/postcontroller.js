const {Post} = require('../models/index')


module.exports = {
  createPost: async (req, res) => {
    const reqParams = req.body
    Post.create(reqParams).then((result) => {
      res.send(result)
    })
  }
}
