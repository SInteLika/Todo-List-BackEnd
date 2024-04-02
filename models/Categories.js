import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    iconName:{
        type: String,
        default: 'Default',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:  true
    },
})


export default mongoose.model('Categories', CategoriesSchema)