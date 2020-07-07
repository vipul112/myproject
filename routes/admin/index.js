const express=require('express');
const router=express.Router();
//const faker=require('faker');
const Post=require('../../models/Posts.js');
//const Category=require('../../models/categories.js');
const Comment=require('../../models/Comments.js');
const User=require('../../models/User.js');
const {userAuthenticated}=require('../../helpers/authentication.js');
router.all('/*',userAuthenticated ,(req,res,next)=>{

  req.app.locals.layout= 'admin';
  next();
});

router.get('/',(req,res)=>{
  Post.countDocuments({}).then(postCount=>{
    Comment.countDocuments({}).then(commentCount=>{
        User.countDocuments({}).then(userCount=>{
          res.render('admin/index',{postCount: postCount,commentCount:commentCount,userCount:userCount});
        });


    });

  });


});





module.exports=router;
