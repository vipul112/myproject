const express=require('express');
const router=express.Router();
const Post=require('../../models/Posts.js');
//const Category=require('../../models/categories.js');
const {userAuthenticated}=require('../../helpers/authentication.js');

router.all('/*',userAuthenticated,(req,res,next)=>{

  req.app.locals.layout= 'admin';
  next();
});

router.get('/',(req,res)=>{
  Post.find({})
  .then(posts=>{
    res.render('admin/posts',{posts: posts});
  });
});
router.get('/create',(req,res)=>{
  res.render('admin/posts/create');
});



router.get('/my-posts',(req,res)=>{
  Post.find({user: req.user.id})
  .then(posts=>{
    res.render('admin/posts/my-posts',{posts: posts});
  });

});




router.post('/create',(req,res)=>{

    console.log(req.files);
    let file=req.files.file;
    let filename=file.name;

    file.mv('./public/uploads/' + filename,(err)=>{
      if(err) throw err;
    });


  let allowComments=true;
  if(req.body.allowComments)
  {
    allowComments=true;
  }
  else {
    allowComments=false;
  }



  const newPost= new Post({
    user: req.user.id,
    title: req.body.title,
    status: req.body.status,
    allowComments: allowComments,
    body: req.body.body,
    file: filename,
    //category: req.body.category,
    Date: req.body.Date
  });

newPost.save().then(savedPost =>{

  req.flash('success_message',`Post ${savedPost.title} was created successfully`);

  res.redirect('/admin/posts');
  console.log("Data Sved in Database");
}).catch(validator=>{
    //res.render('admin/posts/create',{errors: validator.errors});
  console.log(validator);
});


});

router.get('/edit/:id',(req,res)=>{

    Post.findOne({_id: req.params.id}).then(post=>{
        res.render('admin/posts/edit',{post: post});
      });


  });

router.put('/edit/:id',(req,res)=>{

  Post.findOne({_id: req.params.id}).then(post=>{
    if(req.body.allowComments)
    {
      allowComments=true;
    }
    else {
      allowComments=false;
    }
    post.user=req.user.id;
    post.title=req.body.title;
    post.status=req.body.status;
    post.allowComments=allowComments;
    post.body=req.body.body;
    //post.category=req.body.category;
    //post.file=req.body.file;
    let file=req.files.file;
    let filename=Date.now()+ '-' +file.name;
    post.file=filename;

    file.mv('./public/uploads/' + filename,(err)=>{
      if(err) throw err;
    });
    post.save().then(updatedPost=>{
      req.flash('success_message',`Post ${updatedPost.title} updated successfully`);
      res.redirect('/admin/posts/my-posts');
    });
});

});

router.delete('/:id',(req,res)=>{

      Post.findOne({_id:req.params.id}).populate('comments')
      .then((post)=>{


          if(!post.comments.length <1){
            post.comments.forEach(comment=>{
              comment.remove();
            });
          }
        post.remove().then(removedPost=>{
          req.flash('success_message',`Post Deleted`);
          res.redirect('/admin/posts/my-posts');
        });

      });

});



module.exports=router;
