const { validationResult } = require('express-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const {getDB} = require('../database.js')



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

        const secret = process.env.Password_Secret;
        const hash = crypto.createHmac('sha256', secret)
               .update(password)
               .digest('hex');      
        // console.log(hash);

        db.collection('User').insertOne({
            name,
            email,
            "password":hash
        });

        return res.json({
            success: true,
            message: 'Signup success'
          });

}
}


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

        const secret = process.env.Password_Secret;
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