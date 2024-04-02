import mongoose from "mongoose";

const TaskActiveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required:  true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

export default mongoose.model('TaskActive', TaskActiveSchema)