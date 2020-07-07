const mongoose=require('mongoose');

const Schema= mongoose.Schema;

const userSchema=new Schema({


  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    //required: true
  },
  rememberMe:{
    type: Boolean,

  },
  //id:{
    //type: String,
    //required: true
  //},
  token:{
    type: String,
    //required: true
  },
  date:{
    type: Date,
    default: Date.now()
  }
});
module.exports=mongoose.model('users',userSchema);
