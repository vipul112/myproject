const express=require('express');
const Post=require('../../models/posts.js');
const Comment=require('../../models/comments.js');
const {userAuthenticated}=require('../../helpers/authentication.js');
const router=express.Router();


router.all('/*',userAuthenticated,(req,res,next)=>{

  req.app.locals.layout= 'admin';
  next();
});


router.get('/',(req,res)=>{
  Comment.find({user: req.user.id}).populate('user')
  .then(comments=>{
    res.render('admin/comments',{comments: comments});
  });



});

router.delete('/:id',(req,res)=>{

      Comment.remove({_id:req.params.id}).then((result)=>{
        req.flash('success_message',`Comment Deleted`);
        res.redirect('/admin/comments');
      });

});



router.post('/',(req,res)=>{

  Post.findOne({_id: req.body.id}).then(post=>{
      const newComment=new Comment({
        user: req.user.id,
        body: req.body.body
      });
     post.comments.push(newComment);
     post.save().then(savedPost=>{
          newComment.save(savedComm=>{
            //res.redirect(`/ho`);
            res.redirect(`/home/post/${post.id}`);
            })
          });

       });
});



//res.send('it works')




module.exports=router;
