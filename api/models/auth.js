import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    liked: {
        type: [String],
        default: []
    },
    avatar: {
        type: String,
        default : "https://i.hizliresim.com/t2gwjp0.jpg"
    },
    followings: {
        type: [String]
    },
    followers: {
        type: [String]
    },
    followingTopics: {
        type: [String]
    }
},{timestamps:true});

const Auth = mongoose.model("Auth",AuthSchema);

export default Auth;