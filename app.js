const express= require('express');
const app=express();
const path=require('path');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const passport=require('passport');
const session=require('express-session');
const flash=require('connect-flash');
const LocalStrategy=require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {mongoDbUrl}=require('./config/database.js')
const upload=require('express-fileupload');


//const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

mongoose.Promise=global.Promise;
mongoose.connect(mongoDbUrl,{useNewUrlParser:true}).then(db=>{
  console.log('connected');
});

app.use(express.static(path.join(__dirname,'public')));
//app.use(express.static('views/images'));
const {select}=require('./helpers/handlebar-helpers');

//VIEW ENGINE
app.engine('handlebars',exphbs({defaultLayout: 'main',helpers: {select: select}}));
app.set('view engine','handlebars');

//UPLOAD MIDDLEWARE
app.use(upload());

//PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//METHOD override
app.use(methodOverride('_method'));

app.use(session({

    secret:'kjlkhj',
    resave: true,
    saveUninitialized: true


}));
app.use(flash());

//PASSPORTA
app.use(passport.initialize());
app.use(passport.session());

var user='';
app.use((req,res,next)=>{
  res.locals.user = req.user || user;
  res.locals.success_message=req.flash('success_message');
  res.locals.danger_message=req.flash('danger_message');
  res.locals.error= req.flash('error');
  next();
});

//routes
const main= require('./routes/mainloginroute/index');
const admin= require('./routes/admin/index');
const home = require('./routes/home/index');
const posts = require('./routes/admin/posts');
const comments = require('./routes/admin/comments')
//USING ROUTES
app.use('/',main);
app.use('/admin',admin);
app.use('/home',home);
app.use('/admin/posts',posts);
app.use('/admin/comments',comments);



var port = process.env.PORT | 3000;
app.listen(port,()=>{
  console.log(`listening to port `+port);
});
