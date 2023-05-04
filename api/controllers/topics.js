import Topic from '../models/topic.js';
import Auth from '../models/auth.js';

//create a topic
export const createTopic = async (req,res,next) => {
    try{
        const topic = await new Topic(req.body);

        const savedTopic = await topic.save();

        res.status(200).json(savedTopic)
    }catch(err){
        console.log(err);
    }
};
//delete a topic
export const deleteTopic = async (req,res,next) => {
    try{
        await Topic.findByIdAndDelete(req.params.postId);

        res.status(200).json("Topic deleted successfuly");
    }catch(err){
        console.log(err);
    }
};
//get todays topics
export const getTodaysTopics = async (req,res,next) => {
    try{
        const topics = await Topic.find({createdAt:{$gt:new Date(Date.now() - 24*60*60 * 1000)}});

        res.status(200).json(topics)
    }catch(err){
        console.log(err)
    }
};

//get most talked topics
export const getAllTopics = async (req,res,next) => {
    try{
        const topics = await Topic.find();

        res.status(200).json(topics)
    }catch(err){
        console.log(err)
    }
};
//get a topic
export const getTopic = async (req,res,next) => {
    try{
        const topic = await Topic.findById(req.params.topicId);

        res.status(200).json(topic)
    }catch(err){
        console.log(err)
    }
};

//get a topic by desc
export const getTopicByDesc = async (req,res,next) => {
    try{
    
        const topic = await Topic.findOne({desc:req.params.desc});

        res.status(200).json(topic)
    }catch(err){
        console.log(err)
    }
};

//get following topics
export const getFollowingTopics = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.user.id);
        !user && res.status(404).json("User not found");

        const topics =await Promise.all(user.followingTopics.map(async(topicId) => {
            return await Topic.findById(topicId)
        }));

        res.status(200).json(topics)
    }catch(err){
        console.log(err)
    }
};
