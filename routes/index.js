var express = require('express');
var router = express.Router();
const usermodel =require('./users');
const productmodel =require('./product')
const passport=require('passport');
const config =require('../config/config');
const multer =require('multer')
const localStreatgy=require('passport-local');
passport.use(new localStreatgy(usermodel.authenticate()))

  

const profileimg = multer({ storage:config.profileimg })
const productimages= multer({ storage:config.productimg})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',function(req,res){
 let newUser= new  usermodel({
name:req.body.name,
username:req.body.username,
contactnumber:req.body.contactnumber,
isseller:req.body.isseller,
email:req.body.email

})
usermodel.register(newUser,req.body.password)
.then(function(){
 passport.authenticate('local')(req,res,function(){
   res.redirect('/profile')
})

})
})


router.post('/login',passport.authenticate('local',{
  successRedirect:"/profile",
  failureRedirect:"/"

}),function(req,res,next){});


router.get('/profile',isLoggedin,async function(req, res) {
let user =await req.user.populate('products')
console.log(user)
// console.log("hello")
  res.render('profile',{userdata:user})
  
});





// for verification

router.get('/verified',function(req,res){
  let user =usermodel.findOne({username:req.session.passport})
  console.log(user)
res.render('verify',{data:req.user})
})

router.post('/verified',isLoggedin,function(req,res){

let data={
name:req.body.name,
username:req.body.username,
contactnumber:req.body.contactnumber,
email:req.body.email,
gastin:req.body.gastin,
adress:req.body.adress
}

let user =usermodel.findByIdAndUpdate({username:req.session.passport},data)
res.redirect('/profile',{data:req.user})

})

// router.get('/products',isLoggedin,function(req,res){
//   const user=usermodel.findOne({username:req.session.passport.user})
//   console.log(user)
//   res.render('products',{data:req.user})
// })

router.get('/products', isLoggedin, function(req, res) {
  const user = usermodel.findOne({username: req.session.passport.user}).populate('products')
  const products = user.products;
  console.log(user)
  res.render('products', {data:products});
});

// image-upload

router.get('/upload',productimages.single('dpimage'),function(req,res){
  var user =usermodel.findOne({username:req.session.passport.user})
user.dpimage=req.file.filename
user.save();
})


// -------------------create-product----------------
router.post("/create/product",isLoggedin,productimages.array("image",3),async function(req,res,next){
  let user=  await usermodel.findOne({username:req.session.passport.user}).populate('products');
   if(user.isseller){ 
     const productData={
         sellerid:user._id,
         productname:req.body.productname,
         pic:req.files.map(fn=>fn.filename),
         des:req.body.des,
         price:req.body.price,

     }


     let userproductmodel=await  productmodel.create(productData);
     user.products.push(userproductmodel._id);
     await user.save();
     console.log(user);
     res.redirect("/profile");
   }else{
        res.send("yor don't have a vendor Account");
   } 
});



function isLoggedin(req,res,next){

  if(req.isAuthenticated()){
  
    return next();
  }
  else{
    res.redirect('/')
  }
  }


  
module.exports = router;
