import mongoose from "mongoose";

const StatisticsSchema = new mongoose.Schema({
    weekData: {
        type: Number,
        required: true
    },
    lastWeekCreated: {
        type: Number,
        default: 0,
        required: true
    },
    lastWeekFulfilled: {
        type: Number,
        default: 0,
        required: true
    },
    lastWeekDeleted: {
        type: Number,
        default: 0,
        required: true
    },
    mostCreated: {
        type: Array,
        default: [0, 0, 0, 0, 0, 0, 0],
        required: true
    },
    mostFulfilled: {
        type: Array,
        default: [0, 0, 0, 0, 0, 0, 0],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})
export default mongoose.model('Statistics', StatisticsSchema)