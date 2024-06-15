var express = require('express');
const { listen } = require('../app');
var router = express.Router();
const userModel = require("./users.js");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require("../routes/multer.js")
const postModel = require("./post.js")

passport.use(new localStrategy(userModel.authenticate()))


router.get('/', function(req, res, next) {
  res.render('index.ejs' , {nav:false});
});

router.get("/register" , (req , res)=>{
  res.render("register.ejs" , {nav:false});
})


router.get("/profile" , isLoggedIn ,  async (req , res)=>{
  const user  =  await userModel.
  findOne({username : req.session.passport.user}).populate("posts");


  res.render("profile.ejs" , {user , nav:true});
})

router.get("/show/posts" , isLoggedIn , async (req , res)=>{
const user = await userModel.findOne({username : req.session.passport.user}).populate("posts")
res.render("show.ejs" , {user , nav:true} )
})

router.post("/register" , (req , res)=>{
   const data = new userModel({
    username : req.body.username,
    email : req.body.email,
    contact : req.body.contact,
    name : req.body.fullname,
   })

   userModel.register(data , req.body.password)
   .then(function(){
    passport.authenticate("local")(req , res , function(){
      res.redirect("/profile");
    })
   })
})




router.post("/login" , passport.authenticate("local" , {
  successRedirect : "/profile",
  failureRedirect  : "/"
}) , (req , res)=>{

})

router.post("/fileupload" , isLoggedIn , upload.single("image") , async (req , res)=>{
  let user = await userModel.findOne({username : req.session.passport.user});
  user.profileimage =  req.file.filename;
  await user.save();
  res.redirect("/profile")
})


router.get("/logout" , (req , res , next)=>{
  req.logout(function(err){
    if(err) {  return next(err) };

    res.redirect("/")
  })
})

router.get("/add" ,isLoggedIn , async (req , res)=>{
  let user = await userModel.findOne({username : req.session.passport.user});
  res.render("add.ejs" , {user , nav: true})

})

router.post("/createpost" , isLoggedIn , upload.single("postimage") , async (req , res)=>{
  let user = await userModel.findOne({username : req.session.passport.user});
  let post = await postModel.create({
    user : user._id,
    title : req.body.title , 
    description : req.body.description,
    image : req.file.filename,

  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
});

router.get("/feed" , isLoggedIn , async (req , res)=>{
  let user = await userModel.findOne({username : req.session.passport.user});
  let posts = await postModel.find().populate("user");

  res.render("feed.ejs" , {user , posts , nav:true});
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}




module.exports = router;
