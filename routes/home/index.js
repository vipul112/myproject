const express=require('express');
const router=express.Router();
//const faker=require('faker');
const Post=require('../../models/Posts.js');
//const Category=require('../../models/categories.js');
const Comment=require('../../models/Comments.js');
const User=require('../../models/User.js');
const {userAuthenticated}=require('../../helpers/authentication.js');
router.all('/*',userAuthenticated,(req,res,next)=>{

  req.app.locals.layout= 'home';
  next();
});

router.get('/',(req,res)=>{
  Post.find({}).then(posts=>{
    res.render('home/index',{posts: posts});
  })

  router.get('/about',(req,res)=>{
    Post.countDocuments({}).then(counteddocs=>{
      Comment.countDocuments({}).then(countedcoms=>{
        User.countDocuments({}).then(counteduser=>{
          res.render('home/about',{counteddocs:counteddocs,countedcoms:countedcoms,counteduser:counteduser});
        });


      });

    });
  });

  router.get('/contact',(req,res)=>{
    res.render('home/contact');
  });


});

router.get('/post/:id',(req,res)=>{
  Post.findOne({_id: req.params.id}).populate({path: 'comments', populate: {path: 'user',model: 'users'}})
  .populate('user')
  .then(post=>{
    console.log(post);
    //Category.find({}).then(categories=>{

       res.render('home/ExpandPost',{post:post});


    //});

  });
  //res.render('home/ExpandPost');

});
module.exports=router;
