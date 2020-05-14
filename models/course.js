const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  //* шаблон объекста курса
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId, // чтобы mongoose мог понимать, что это айди
    ref: "User",
  },
});

courseSchema.method("toClient", function () {
  const course = this.toObject(); // !объект данного курса

  course.id = course._id;
  delete course._id;
  return course;
});

module.exports = model("Course", courseSchema);
