const express    = require("express");
const path       = require("path");
const csrf       = require("csurf")
const flash      = require("connect-flash")
const mongoose   = require("mongoose");
const exphbs     = require("express-handlebars");
const session    = require("express-session")
const MongoStore = require("connect-mongodb-session")(session)
const homeRoutes    = require("./routes/home");
const cardRoutes    = require("./routes/card");
const addRoutes     = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const ordersRoutes  = require("./routes/orders");
const authRouters   =  require("./routes/auth")
const varMidlleware = require("./middleware/variables")
const userMidlleware = require("./middleware/user")
const keys = require("./keys")


    

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

const store = new MongoStore({
  collection:"sessions",
  uri: keys.MONGODB_URI
})

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// app.use(async (req, res, next) => {
//   // ? middleware for check user
//   try {
//     const user = await User.findById("5ea6daccefeeb91f1c36aa36"); // ? МОКовский id
//     req.user = user; // Полноценный объект mongoose
//     next(); // !выполнять другие middleware
//   } catch (e) {
//     console.log(e);
//   }
// });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized:false,
  store
}))
app.use(csrf())
app.use(flash())
app.use(varMidlleware) // отвечает за то, что бы при логине изменялся isAuth  
app.use(userMidlleware) // отвечает за req.user == req.session.user
// тут всё нормально
app.use("/", homeRoutes);  
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRouters)
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    // const candidate = await User.findOne(); // чтобы найти хотбы одного юзера
    // if (!candidate) {
    //   const user = new User({
    //     email: "happy.nan9@mail.ru",
    //     name: "Kirill",
    //     card: { items: [] },
    //   });
    //   await user.save(); // User from models
    // }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
