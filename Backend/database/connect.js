

const mongoose=require('mongoose')
const jwt=require("jsonwebtoken");
const { type } = require('@testing-library/user-event/dist/type');
  mongoose.connect('mongodb://localhost:27017/Job',{
    useNewUrlParser:true,
    useUnifiedTopology:true
  });


    const userSchema=new mongoose.Schema({
        image:{
          type:String    
        },
        name:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String
        },
        Cpassword:{
           type:String
        },
        phoneNumber:{
            type:Number
        },
        address:{
            type:String
        },
        tokens:[{
            token:{
                type:String
            }
        }
        ]

    })
    async function myToken(){
    userSchema.methods.createToken=async function(){
      const token=  jwt.sign({_id:this._id},"aajflakjhfkfjhlkjsfhfhajkhfakjfhfhklajfhkjfhkajhfhfjfajlkafjkjshbfjhbkjrgbskjgbksjbalfjafkj");
      this.tokens= this.tokens.concat({token})
           await  this.save();
      return token;
    }
}
myToken();


    const userModel=mongoose.model("User-data",userSchema)

    module.exports=userModel;