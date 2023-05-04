import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    postName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    nickname: {
        type:String,
        required: true
    },
    sequence: {
        type: Number,
        required: true
    },
    like: {
        type: [String],
        default: []
    }
},{timestamps:true});

const Entry = mongoose.model("Entry",EntrySchema);

export default Entry;