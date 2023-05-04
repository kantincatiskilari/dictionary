import Auth from "../models/auth.js";

//get a user
export const getUser = async (req,res,next) => {
    try{
        const user = await Auth.findOne({nickname:req.params.nickname});
        let { password, ...others } = user._doc;
        res.status(200).json(others)
    }catch(err){
        console.log(err);
    }
};
//get a user by id
export const getUserId = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.params.userId);
        let { password, ...others } = user._doc;
        res.status(200).json(others)
    }catch(err){
        console.log(err);
    }
};

//update a user
export const updateUser = async (req,res,next) => {
    try{
        const updatedUser = await Auth.findByIdAndUpdate(req.user.id,{$set:req.body},{new:true});

        let { password, ...others } = updatedUser._doc;

        res.status(200).json(others)
    }catch(err){
        console.log(err);
    }
};

//delete user
export const deleteUser = async (req,res,next) => {
    try{
        await Auth.findByIdAndDelete(req.user.id);
        res.status(200).json("User deleted successfuly")
    }catch(err){
        console.log(err);
    }
};

//follow user
export const followUser = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.user.id);

        if(!Auth.findById(req.params.userId)){
            res.status(404).json("User not found.");
        } else if(user.followings.includes(req.params.userId)){
            res.status(500).json("You are already following this user.")
        } else {
            await Auth.findByIdAndUpdate(req.user.id,{$push:{followings:req.params.userId}});
            await Auth.findByIdAndUpdate(req.params.userId,{$push:{followers:req.user.id}});

            res.status(200).json("User has been followed");
        }
    }catch(err){
        console.log(err);
    }
};

//unfollow user
export const unfollowUser = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.user.id);

        if(!Auth.findById(req.params.userId)){
            res.status(404).json("User not found.");
        } else if(!user.followings.includes(req.params.userId)){
            res.status(500).json("You are not following this user.")
        } else {
            await Auth.findByIdAndUpdate(req.user.id,{$pull:{followings:req.params.userId}});
            await Auth.findByIdAndUpdate(req.params.userId,{$pull:{followers:req.user.id}});

            res.status(200).json("User has been unfollowed");
        }
    }catch(err){
        console.log(err);
    }
};

//follow topic
export const followTopic = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.user.id);

        if(!Auth.findById(req.params.userId)){
            res.status(404).json("User not found.");
        } else if(user.followingTopics.includes(req.params.topicId)){
            res.status(500).json("You are already following this topic.")
        } else {
            await Auth.findByIdAndUpdate(req.user.id,{$push:{followingTopics:req.params.topicId}});
            res.status(200).json("Topic has been followed");
        }
    }catch(err){
        console.log(err);
    }
};

//unfollow topic
export const unfollowTopic = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.user.id);

        if(!Auth.findById(req.params.userId)){
            res.status(404).json("User not found.");
        } else if(!user.followingTopics.includes(req.params.topicId)){
            res.status(500).json("You are not following this topic.")
        } else {
            await Auth.findByIdAndUpdate(req.user.id,{$pull:{followingTopics:req.params.topicId}});
            res.status(200).json("Topic has been unfollowed");
        }
    }catch(err){
        console.log(err);
    }
};