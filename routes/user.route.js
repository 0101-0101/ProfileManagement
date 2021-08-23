const express = require('express')
const router = express.Router()

const { registerController, signinController, userPost, activationController } = require('../controllers/auth.controller')

const { validSign, validLogin } = require('../helpers/valid')

router.post('/register', validSign, registerController)

router.get('/activation/:token', activationController)

router.post('/login', validLogin, signinController)

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos')
  }
})

const upload = multer({ storage: storage })

router.post('/profile', upload.single('photo'), function (req, res) {
  userPost(req, res)
})

module.exports = router
