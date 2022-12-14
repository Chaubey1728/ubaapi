const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const signUpSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    }

});




signUpSchema.pre('save', async function(next) {
    
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});



module.exports= mongoose.model('Registeredusers', signUpSchema );