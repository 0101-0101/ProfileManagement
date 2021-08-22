const { validationResult } = require('express-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const {getDB} = require('../database.js')

const nodemailer = require('nodemailer')



exports.registerController = async (req,res) => {
    var db = getDB()
    const { name , email , password } = req.body;
    const errors = validationResult(req);

    // console.log( { name , email , password })
     
    if (!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0];
        // 422 Unprocessable Entity:The request was well-formed but was unable to be followed due to semantic errors.
        return res.status(422).json({
            errors : firstError
        })
    } else{
        const user = await db.collection('User').findOne({ email })
        // console.log(user)
        if( user ){
            return res.status(400).json({
                errors: 'Email is taken'
            })
        }

        const token = jwt.sign(
          {
              name,email,password
          },
          process.env.JWT_ACCOUNT_ACTIVATION,
          {
              expiresIn:'30m'
          })


        var auth = {
            type: 'oauth2',
            user: process.env.YOUR_GMAIL_ADDRESS,
            clientId: process.env.YOUR_CLIENT_ID,
            clientSecret: process.env.YOUR_CLIENT_SECRET,
            refreshToken: process.env.YOUR_REFRESH_TOKEN,
        };
    
        var emailData = {
            from: process.env.YOUR_GMAIL_ADDRESS,
            to: email,
            subject: 'Account Register',
            // text: req.body.message,
            html: `
            <h1>Please use the following to activate your account</h1>
            <p>${process.env.CLIENT_URL}/activation/${token}</p>
            <hr />
            <p>This email may containe sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `
        };
    
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: auth,
        });
    
        transporter.sendMail(emailData, (err, res) => {
            if (err) {
                return console.log(err);
            } else {
                console.log(JSON.stringify(res));
            }
        });

        return res.json({
            success: true,
            message: 'Signup success'
          });

}
}


exports.activationController =  (req, res) => {
  var db = getDB()
  const  token  = req.params.token;
  console.log(token)

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again'
        });
      } else {
        // console.log("Decoded",decoded)
        // const { name, email, password } = jwt.decode(token);
        const { name, email, password } = decoded
        // console.log(name,email,password)`;

        const secret = process.env.PASSWORD_SECRET;
        // Hmac(hash-based message authentication code)
        const hash = crypto.createHmac('sha256', secret)
                        // updating data
                        .update(password)
                        // Encoding to be used
                        .digest('hex');  

        // console.log(hash);

        

       const user = await db.collection('User').insertOne({name,email,"password":hash});
       console.log("User",user.insertedId)

       if( user ){
        return res.json({
          success: true,
          message: user.insertedId,
          message: 'Signup success'
        });
      }else{
        return res.status(401).json({
          errors: "User Activation Error"
      })
      }

      }
    });
  } else {
    return res.json({
      message: 'error happening please try again'
    });
  }
};


exports.signinController = async (req, res) => {
    var db = getDB()

    const { email, password } =  req.body;

    const user = await db.collection('User').findOne({ email })
    // console.log(user)

    const errors = validationResult(req);

    // console.log({ email, password })

    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        errors: firstError
      });
    } else {
      // check if user exist
    //   const user = db.collection('User').find({ email })

      if ( !user ){
        return res.status(400).json({
            errors: 'User with that email does not exist. Please signup'
          });
        }

        const secret = process.env.PASSWORD_SECRET;
        const hash = crypto.createHmac('sha256', secret)
               .update(password)
               .digest('hex');
        if ( ! user.password == hash){
            return res.status(400).json({
                errors: 'Email and password do not match'
              });
        }
        
        // generate a token and send to client
        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
            );
            const { _id, name, email } = user;    
            return res.json({
            token,
            user: {
                _id,
                name,
                email,
            }
            });
    }
  };

exports.user_post = async (req, res) => {
    var db = getDB()
    console.log(req.body); // form fields
    console.log(req.body.title,req.file.path);
      const requestBody = {
        Name: req.body.Name,
        age : req.body.age,
        address: req.body.address,
        photo: req.file.path
      }

      
      
      try{
        db.collection('Profile').insertOne(requestBody);
        res.status(201).json(requestBody)
      }catch(e){
          console.log("error",e)
          res.status(400).send(e)
      }
  }