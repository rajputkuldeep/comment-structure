const {User, Comment, Post} = require('./../models/index')
const Mongoose = require('mongoose')

module.exports = {
  createComment: async (req, res) => {
    const authID = req.body.authId
    Post.findOne({_id: Mongoose.Types.ObjectId(req.body.post_id)}).then((postData) => {
      User.findOne({_id: Mongoose.Types.ObjectId(postData.user_id)}).then((postUserData) => {
        User.find({_id: postUserData.friends}).select('friends').then((friendsData) => {
          let temp = []
          friendsData.map((x) => {
            if (x.friends.length > 0) {
              x.friends.map((item) => {
                temp.push(item)
              })
            }
          })
          temp = [...temp, ...postUserData.friends, authID]
          if (temp.includes(authID.toString())) {
            if (req.body.stage === 2 && !req.body.comment_id) {
              return res.send("Please enter comment id")
            }
            Comment.create(req.body).then((result) => {
              res.send(result)
            })
          } else {
            res.send("Are you not the friend or f-o-f.")
          }
        })
      })
    }).catch((e) => {
      console.log(e, "error")
    })

  },

  commentList: async (req, res) => {
    Comment.find({post_id: req.params.id}).populate('post_id', ['user_id']).then((data) => {
      let stageOne = [], stageTwo = [], stageThree = []
      const words = ['Comment', 'screen', 'mouse', 'monitor', 'if', 'else', 'right', 'wrong', 'ankit', 'karan', 'skype', 'email']
      const user_id = data[0].post_id.user_id.toString()
      data.map((item) => {
        if (user_id !== req.body.authid) {
          let str = item.content.split(' ')
          str.map((s) => {
            if (words.includes(s)) {
              const index = str.indexOf(s)
              str[index] = '*'
            }
          })
          item.content = str.join(' ')
        }

        if (item.stage === 1) {
          stageOne.push(item)
        } else if (item.stage === 2) {
          stageTwo.push(item)
        } else {
          stageThree.push(item)
        }
      })

      const second = []
      stageTwo.map((i) => {
        const obj = {
          post_id: i.post_id,
          content: i.content,
          stage: i.stage,
          comment_id: i.comment_id,
          nestS: stageThree.filter((x) => x.nested_comment_id.toString() === i._id.toString())
        }
        second.push(obj)
      })

      const finaldata = []
      for (let i = 0; i < stageOne.length; i++) {
        const obj = {
          post_id: stageOne[i].post_id,
          content: stageOne[i].content,
          stage: stageOne[i].stage,
          nestComment: stageOne[i].arr = second.filter((x) => x.comment_id.toString() === stageOne[i]._id.toString())
        }
        finaldata.push(obj)
      }
      res.send(finaldata)
    })
  }
}
