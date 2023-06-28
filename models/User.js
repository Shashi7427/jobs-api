const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please provide the name"],
        minlength:3,
        maxlength:59,
    },
    email:{
        type:String,
        require:[true,"Please provide the email"],
        math:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please Provide the valid email"],
        unique:true,
    },
    password:{
        type:String,
        require:[true,"Please provide the Password"],
        minlength:6,
    },
})
// use function here so that we can point to our document
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// using the scehma methods; 
UserSchema.methods.createJWT = function(){
    // user allkeygenerated website to generate a secrete key
    const token = jwt.sign({userId : this._id,name:this.name},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME
    })
    return token;
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };

module.exports = mongoose.model('User',UserSchema)