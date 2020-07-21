var express = require("express");
var router = express.Router();
var paypal = require("paypal-rest-sdk");
const db = require("../scheme_model");
const EUserTypes = require("../enums/EUserTypes");

var tuition;
var item;

//sb-hdnzg2593851@personal.example.com
//EWG3&u}7
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AY2ejbqohr7SeiWmV3_ctJEsLJsjAYzNyuNdgLh7GK7sGjwvrncrBBB7G1BogCeiSGe5pArnfsC0hcf8",
  client_secret:
    "EN4LcxQAjzZ8hDgbq797spEIJY6o-7suhhTyXWRnyUXZlnzp47B-Kv3BBsQvqTPc-dmPub0jw592l8mB",
});

/* GET pay page. */
router.post("/", function (req, res, next) {
  console.log(req.query);
  const courseName = req.query.courseName;
  tuition = req.query.tuition;
  item = req.body;
  item.userID = req.session.authUser._id || req.query.authUser;

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3001/pay/success",
      cancel_url: "http://localhost:3001/pay/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: courseName,
              price: tuition,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: tuition,
        },
        description: courseName,
      },
    ],
  };

  console.log("item: ", item);
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        const element = payment.links[i];
        if (element.rel === "approval_url") {
          res.redirect(element.href);
        }
      }
    }
  });
});

router.get("/success", function (req, res, next) {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: tuition,
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, async function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      err_message = "Đăng ký thất bại";
      row = null;
      return res.render("vwCourses/detail", {
        course: row,
        empty: row == null,
        err_message,
      });
    } else {
      //console.log('Get Payment Response');
      const course = await db.Course.findById({ _id: item.courseID });

      if (course.studentList.length > 0) {
        const found = course.studentList.find(
          (x) => x.toString() === item.userID.toString()
        );
        console.log(found);
        if (found) {
          success_checkout_message = "Đăng ký khóa học thành công";
          row = null;
          return res.render("vwCourses/detail", {
            course: row,
            empty: row == null,
            success_checkout_message,
            courseID: item.courseID
          });
        }
        course.studentList.push(item.userID);
        await course.save();
      } else {
        course.studentList.push(item.userID);
        await course.save();
      }

      db.User.findByIdAndUpdate(
        { _id: item.userID, role: EUserTypes.STANDARD },
        {
          $set: {
            role: EUserTypes.STUDENT,
          },
        }
      ).exec();

      console.log(JSON.stringify(payment));
      success_checkout_message = "Đăng ký khóa học thành công";
      row = null;
      return res.render("vwCourses/detail", {
        course: row,
        empty: row == null,
        success_checkout_message,
        courseID: item.courseID
      });
    }
  });
});

router.get("/cancel", function (req, res, next) {
  res.send("Cancelled");
});

module.exports = router;
