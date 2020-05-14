const {Router} = require("express")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const User = require("../models/user")
const router = Router()



const transporter= nodemailer.createTransport()

router.get("/login", (req,res)=>{
  res.render("auth/login",{
    title:"Авторизация",
    isLogin:true,
    loginError:req.flash('loginError'),
    registerError:req.flash("registerError")
  })
})
router.get("/logout", (req,res)=>{
  req.session.destroy(()=>{
    res.redirect("/auth/login#login")

  })
})

router.post("/login", async(req, res)=>{
  console.log('cd', candidate);

  try {
    const {email, password}=req.body

    const candidate = await User.findOne({email})
    if(candidate){
      const areSame = bcrypt.compare(password, candidate.password)
      if(areSame){
        const user = await User.findById("5eaf75af96b5681ea4f4c61f"); // ? МОКовский id
        req.session.user=user
        req.session.isAuthenticated = true  // передаётся в middleware 

        req.session.save(er=>{
        if(er){throw er}
          req.flash("loginError", "Неверный пароль")
          res.redirect('/')
        })
      }else{
      req.flash("loginError", "Такого пользователя не существует")

        res.redirect("/auth/login#login")
      }

    }else{


      res.redirect("/auth/login#login")
    }
  } catch (e) {
    console.log(e);
  }

  
})

router.post("/register", async (req, res)=>{
  try{
    const {email, password, repeat, name} = req.body
    const candidate = await User.findOne({email})

    if(candidate){
      req.flash("registerError", "Такой email уже занят")
      res.redirect("/auth/login#register")
    }else{
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email,name,password:hashPassword,cart:{items:[]}
      })
      await user.save()
      res.redirect("/auth/login#login")
    }


  }catch(e){
    console.log(e);
  }
})

module.exports = router