// Import mongoose for MongoDB object modeling
const mongoose=require('mongoose');

const Schema=mongoose.Schema;
// Define the document schema for collaborative documents
const documentSchema=new Schema({
    title:{
        type: String,
        required:true, // Document title
        default: "Untitled",
    },
    owner:{
        type: String,
        required:true, // User ID of the document owner
    },
    content:{
        type: String, // Document content
    },
    associatedUsers:{
        type: [String] // User IDs associated with this document
    }
},{timestamps:true}) // Automatically adds createdAt and updatedAt fields

// Export the Document model
module.exports=mongoose.model('Document',documentSchema)