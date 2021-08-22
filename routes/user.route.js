const express = require('express')
const router = express.Router()

const { registerController,signinController,user_post,activationController } = require('../controllers/auth.controller')

const { validSign , validLogin } = require('../helpers/valid')

router.post('/register', validSign , registerController)

router.get('/activation/:token', activationController)

router.post('/login',validLogin, signinController)



var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, 'public/photos')
    }
  })
var upload = multer({storage: storage}); 
  
router.post('/profile', upload.single('photo'),  function(req, res){
            user_post(req,res)
          })

module.exports = router
