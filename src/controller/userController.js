const {User} = require('../models/index')
const Mongoose = require('mongoose')
let clearbit = require('clearbit')('sk_029b7c1ebfdaf9662555c2d4ab878811');
const stripe = require('stripe')('sk_test_51Ky98sSImOsyWLaALHqb8bxE5bq7EroOuYMX2KYCZjffNNgAu6dvFImiR2BNhFFXVeiVMpDljrRVACLQHeBOYncV00DslWwijC');
const dataJson = require('../../date.json')
const _ = require('lodash')
const system = require("systeminformation");

module.exports = {
  signup: (req, res) => {
    User.create(req.body).then((data) => {
      res.json({ message: "User created successfully !!" });
    });
  },

  sendFriendReq: (req, res) => {
    const reqParam = req.body;
    User.findOne({ _id: Mongoose.Types.ObjectId(reqParam.reqId) }).then(
      (data) => {
        if (!data) {
          return res.send("Friend not there.");
        }
        data.friend_request.push(reqParam.authId);
        data.save();
        return res.send("Friend req added successfully");
      }
    );
  },
  acceptRejectReq: (req, res) => {
    const reqParams = req.body;
    User.findOne({ _id: Mongoose.Types.ObjectId(reqParams.authId) }).then(
      (data) => {
        const check = data.friend_request.filter(
          (x) => x.toString() === reqParams.fri
        );
        if (check.length === 1) {
          data.friend_request = data.friend_request.filter((x) => {
            x.toString() !== reqParams.fri.toString();
          });
          if (reqParams.type === 1) {
            data.friends.push(reqParams.fri);
            User.findOne({ _id: Mongoose.Types.ObjectId(reqParams.fri) }).then(
              (friData) => {
                friData.friends.push(reqParams.authId);
                friData.save();
              }
            );
            data.save();
            return res.send("Accepted !!!");
          } else {
            //remove from the req friend array
            data.save();
            return res.send("Rejected !!!");
          }
        } else {
          return res.send("Not in Friend req list.");
        }
      }
    );
  },

  userInfo: (req, res) => {
    clearbit.Enrichment.find({ domain: "google.com", stream: true })
      .then(function (response) {
        console.log("Hello there !!!!");
        res.send(response);
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  createCustomer: (req, res) => {
    User.findOne({ email: "kuldeep@mailinator.com" }).then((user) => {
      if (!user) {
        res.send("User not found !");
      }

      stripe.customers.create(
        { email: user.email, name: user.name },
        async (error, customer) => {
          if (error) {
            console.error(error);
            res.send("Error ----- > ", error);
          } else {
            user.stripe_customer_id = customer.id;
            user.save();
            res.send("Stripe customer created successfully !");
          }
        }
      );
    });
  },

  //Add card

  addCard: (req, res) => {
    const reqParams = req.body;
    const tokenObj = {
      name: reqParams.name,
      exp_month: reqParams.exp_month,
      number: reqParams.number,
      exp_year: reqParams.exp_year,
      cvc: reqParams.cvc,
    };
    stripe.tokens.create({ card: tokenObj }).then(async (token) => {
      console.log(token.card.fingerprint, "token.id");

      let user = await User.findOne({ email: "kuldeep@mailinator.com" });
      if (user.fingerprint.includes(token.card.fingerprint)) {
        return res.send("This card already added !");
      }
      user.fingerprint.push(token.card.fingerprint);
      user.save();

      stripe.customers
        .createSource(reqParams.customer_id, {
          source: `${token.id}`,
        })
        .then((card) => {
          res.send(card.id);
        });
    });
  },

  listAllcard: (req, res) => {
    stripe.customers
      .listSources("cus_LfWJPvv7A11dGP", { object: "card", limit: 4 })
      .then((data) => {
        res.send(data);
      });
  },

  createPayment: (req, res) => {
    stripe.paymentIntents
      .create({
        amount: 2000,
        currency: "usd",
        payment_method_types: ["card"],
        customer: "cus_LfWJPvv7A11dGP",
        confirm: true,
        source: "card_1KyDj4SImOsyWLaAztMNFjan",
      })
      .then((data) => {
        console.log(data.id);
        stripe.paymentIntents
          .confirm(`${data.id}`, { payment_method: "pm_card_visa" })
          .then((confirm) => {
            res.send(confirm);
          });
      });
  },

  weekfilter: (req, res) => {
    let temp = [];
    let index = [];
    dataJson.data.map((i) => {
      Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        var today = new Date(
          this.getFullYear(),
          this.getMonth(),
          this.getDate()
        );
        var dayOfYear = (today - onejan + 86400000) / 86400000;
        return Math.ceil(dayOfYear / 7);
      };
      var today = new Date(i.date);
      var currentWeekNumber = today.getWeek();
      let obj = {};
      obj[currentWeekNumber] = i;
      index.push(currentWeekNumber);
      temp.push(obj);
    });
    console.log(temp);
    console.log(index, "index");

    let uniq = [...new Set(index)];
    console.log(uniq);
    let result = [];
    uniq.map((itm) => {
      let arr = _.filter(temp, function (o) {
        return Object.keys(o)[0] == itm;
      });
      let pre = [];
      arr.map((i) => {
        pre.push(i[itm]);
      });
      result.push(pre);
    });
    res.send(result);
  },

  systeminfo: (req, res) => {
    system
      .cpu()
      .then((data) => {
        console.log(data, "cpu ");
        system.networkStats().then((data) => {
          console.log(data, "networkStats");
        });
      })
      .catch((error) => console.error(error));
  },
};
