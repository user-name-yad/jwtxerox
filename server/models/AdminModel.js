const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const AdminSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    }
})

AdminSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})


const Admin = mongoose.model('Admin',AdminSchema)
module.exports = Admin