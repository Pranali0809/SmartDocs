// Import mongoose for MongoDB object modeling
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

// Define the user schema for MongoDB
const userSchema=new Schema({
    uid:{
        type: String,
        required:true, // Firebase user ID
        unique: true,
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    password:{
        type: String,
        required: true, // Hashed password
    },
    createdDocuments:{
        type: [String] // IDs of documents created by the user
    },
    associatedDocuments:{
        type: [String] // IDs of documents the user is associated with
    }
},{timestamps:true}) // Automatically adds createdAt and updatedAt fields

// Export the User model
module.exports=mongoose.model('User',userSchema)