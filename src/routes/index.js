const express = require('express'),
router = express.Router();
const { createPost } = require('../controller/postcontroller')
const {
  commentList,
  createComment,
  getNestedComment,
  indexTask,
  asyncDemo,
} = require("../controller/commentController");
const {
  systeminfo,
  signup,
  sendFriendReq,
  acceptRejectReq,
  userInfo,
  createCustomer,
  createSource,
  addCard,
  listAllcard,
  createPayment,
  weekfilter,
} = require("../controller/userController");
const { route } = require("express/lib/application");

//post
router.post("/post", createPost);

//comment

router.post("/comment", createComment);
router.get("/comment", commentList);
router.get("/nestedComment", getNestedComment);

//User

router.post("/user", signup);
router.post("/send-req", sendFriendReq);
router.post("/accept-reject", acceptRejectReq);

router.get("/get", userInfo);

//stripe

router.post("/create", createCustomer);

//card

router.post("/card", addCard);
router.get("/card", listAllcard);

//source

//router.post('/source' ,createSource)

//payment Intent

router.post("/payment", createPayment);

router.get("/json", weekfilter);

router.get("/system", systeminfo);


router.get("/async", asyncDemo);

module.exports = router;
