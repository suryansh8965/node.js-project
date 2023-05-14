const multer =require('multer');
const path =require('path');
const crypto =require('crypto');

// profileimg

const profileimg = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/profileimages')
    },
    filename: function (req, file, cb) {
crypto.randomBytes(14,function(err,buff){

    const fl =buff.toString('hex')+path.extname(file.originalname)
    cb(null, fl)
})
     
    }
  })

// productimg
const productimg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/productimages')
  },
  filename: function (req, file, cb) {
crypto.randomBytes(14,function(err,buff){

  const fl =buff.toString('hex')+path.extname(file.originalname)
  cb(null, fl)
})
   
  }
})

  module.exports={profileimg,productimg}