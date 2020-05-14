const { Router } = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth")
const router = Router();

router.get("/",auth,  (req, res) => {
  res.render("add", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post("/",auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.imgm,
    userId: req.user, // mongoose сам передаст айди (user === user._id) из-за ObjectId
  });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
