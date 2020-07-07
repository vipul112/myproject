
const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//const {userAuthenticated}=require('../../helpers/authentication.js');


//const configAuth = require('../../config/auth.js');

router.all('/*',(req,res,next)=>{

  req.app.locals.layout= 'main';
  next();
});

router.get('/',(req,res)=>{
  res.render('main/loginpage');
})



router.get('/loginpage',(req,res)=>{
  res.render('main/loginpage');
});
//LogIn
passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{

  console.log(password);
  User.findOne({email: email}).then(user=>{

      if(!user)return done(null,false,{message: 'No User found.'});

      bcrypt.compare(password,user.password,(err,matched)=>{
        if(err) return err;

        if(matched)
        {
          return done(null,user);

        }else{
          return done(null,false,{message: 'Incorrect Password'});
        }
      });
  });
}));

passport.serializeUser(function(user,done){
  done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});


router.post('/loginpage',(req,res,next)=>{

    passport.authenticate('local',{
      successRedirect: '/home',
      failureRedirect: '/loginpage',
      failureFlash: true
    })(req,res,next);

  //res.send('home/login');

});
router.get('/logout',(req,res)=>{
  req.logOut();
  res.redirect('/loginpage');
});
//fb auth
var facebookAuth = {
        'clientID'        : '313732185721366', // facebook App ID
        'clientSecret'    : '89c6c065f690a779a2cffbad7b572f0f', // facebook App Secret
        'callbackURL'     : 'http://localhost:4800/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    };
    passport.serializeUser(function(user,done){
      done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
      User.findById(id,function(err,user){
        done(err,user);
      });
    });
    passport.use(new FacebookStrategy({
    "clientID"        : facebookAuth.clientID,
    "clientSecret"    : facebookAuth.clientSecret,
    "callbackURL"     : facebookAuth.callbackURL,
    'profileURL'      : facebookAuth.profileURL,
    'profileFields'   : facebookAuth.profileFields
},

function (token, refreshToken, profile, done) {
  //var email='vipuldang1998@gmail.com';
    User.findOne({ email : profile.emails[0].value }, function(err, user) {
      //if(err)
      //throw err;
    if (user) {
        console.log("already present");
        return done(null, user);
    } else {
      //var date=Date.now();
      //var rememberMe=true;
      console.log(profile);
      console.log(profile.email);
      console.log(profile.username);
        var newUser = new User();
        //newUser.id = profile.id;
        newUser.email = profile.emails[0].value;
        newUser.token = token;

            //"date":     date,
            //"rememberMe": rememberMe

       newUser.save().then(savedUser=>{
          console.log("user saved");
        });
        //console.log(users);
        return done(null, newUser);
    }
  }).catch(err=>{
    console.log(err);
  });
}));

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.sendStatus(401);
}
router.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
// handle the callback after facebook has authenticated the user
router.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/home",
        failureRedirect : "/signup"
}));

//Fb Auth Finish

//Google auth

var googleAuth = {
        "clientID"      : '16117043997-h1pvdgvcps0n69stqcfpg7tvc2b9jnu8.apps.googleusercontent.com',
        "clientSecret"  : 'UvwEwPzz7ipEqfNQxB5-U4j4',
        "callbackURL"   : 'http://localhost:4800/auth/google/callback'
    };
    passport.use(new GoogleStrategy({

        clientID        : googleAuth.clientID,
        clientSecret    : googleAuth.clientSecret,
        callbackURL     : googleAuth.callbackURL,
    },
    function (token, refreshToken, profile, done) {
      //var email='vipuldang1998@gmail.com';
        User.findOne({ email : profile.emails[0].value }, function(err, user) {
          //if(err)
          //throw err;
        if (user) {
            console.log("already present");
            return done(null, user);
        } else {
          //var date=Date.now();
          //var rememberMe=true;
          console.log(profile);
          console.log(profile.emails[0].value);
          //console.log(profile.username);
            var newUser = new User();
            //newUser.id = profile.id;
            newUser.email = profile.emails[0].value;
            newUser.token = token;

                //"date":     date,
                //"rememberMe": rememberMe

           newUser.save().then(savedUser=>{
              console.log("user saved");
            });
            //console.log(users);
            return done(null, newUser);
        }
      }).catch(err=>{
        console.log(err);
      });
    }));
    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        router.get('/auth/google/callback',
                passport.authenticate('google', {
                        successRedirect : '/home',
                        failureRedirect : '/signup'
                }));
                function isLoggedIn(req, res, next) {

            // if user is authenticated in the session, carry on
            if (req.isAuthenticated())
                return next();

            // if they aren't redirect them to the home page
            res.redirect('/');
        }

        router.get('/signup',(req,res)=>{
          res.render('main/index');
        });

        router.post('/signup',(req,res)=>{
          if(req.body.password !== req.body.confirmPassword)
        {
          req.flash('danger_message',"Password and Confirm Password fields doesnt match");
          console.log("doestmatch"+req.body.password+" "+req.body.confirmPassword);
          res.redirect('/signup');
          //alert("Password and Confirm Password fields doesnt match")
          /*res.render('home/register',{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.*/
        }
        else {
          User.findOne({email: req.body.email}).then(user=>{
            if(user)
            {
              req.flash('danger_message',"User Already Exists");
              res.redirect('/signup');
            }
            else {
              let rememberMe=true;
                if(req.body.rememberMe)
                {
                  rememberMe=true;
                }
                else {
                  rememberMe=false;
                }

                //var id='2';
                var token='gdhdgd675';
              const newUser=new User({
                email: req.body.email,
                password: req.body.password,
                rememberMe: rememberMe,
                date: req.body.date,
                //id: id,
                token: token
              });

              bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                  newUser.password = hash;
                  console.log(hash);
                  newUser.save().then(savedUser=>{
                    console.log("User Added");
                    req.flash('success_message','SignUp Done Please LogIn');
                    res.redirect('/loginpage');
                  });
                });
              });
            }
          });
        }
        //res.send('it works');
        console.log("post route for signup worked");
        });



router.get('/afterloginpage',(req,res)=>{
  res.render('main/afterloginpage');
});

module.exports=router;
