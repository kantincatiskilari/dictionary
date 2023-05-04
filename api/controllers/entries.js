import Entry from '../models/entry.js';
import Topic from '../models/topic.js';
import Auth from '../models/auth.js';

//post an entry
export const postEntry = async (req,res,next) => {
    try{
        const topic = await Topic.findById(req.params.postId);
        if(topic){
            const sequence = await Entry.find()
            const entry = await new Entry({
                ...req.body,
                postId: req.params.postId,
                userId: req.user.id,
                postName: topic.desc,
                sequence:sequence.length + 1
            });
            const savedEntry = await entry.save();
            res.status(200).json(savedEntry)
        } else {
            res.status(404).json("Topic not found");
        }
    }catch(err){
        console.log(err);
    }
};
//delete an entry
export const deleteEntry = async (req,res,next) => {
    try{
        const entry =await Entry.findById(req.params.entryId);
        !entry && res.status(404).json("Entry not found");
        if(req.user.id === entry.userId){   
            await Entry.findByIdAndDelete(req.params.entryId);
            res.status(200).json("Entry deleted successfuly");
        } else {
            res.status(403).json("Not authorized");
        }
    }catch(err){
        console.log(err);
    }
};
//like an entry
export const likeEntry = async (req,res,next) => {
    try{
        const entry =await Entry.findById(req.params.entryId);
        !entry && res.status(404).json("Entry not found");
        if(!entry.like.includes(req.user.id)){   
            await Entry.findByIdAndUpdate(req.params.entryId,{
                $addToSet: {like:req.user.id}
            });
            await Auth.findByIdAndUpdate(req.user.id,{
                $addToSet: {liked:req.params.entryId}
            });
            res.status(200).json("Entry liked successfuly");
        } else {
            res.status(403).json("You already liked this post");
        }
    }catch(err){
        console.log(err);
    }
};
//unlike an entry
export const unlikeEntry = async (req,res,next) => {
    try{
        const entry =await Entry.findById(req.params.entryId);
        !entry && res.status(404).json("Entry not found");
        if(entry.like.includes(req.user.id)){   
            await Entry.findByIdAndUpdate(req.params.entryId,{
                $pull: {like:req.user.id}
            });
            await Auth.findByIdAndUpdate(req.user.id,{
                $pull: {liked:req.params.entryId}
            });
            res.status(200).json("Entry unliked");
        } else {
            res.status(403).json("You did not like this post");
        }
    }catch(err){
        console.log(err);
    }
};
//get topics entries
export const getEntries = async (req,res,next) => {
    try{
        const topic = await Topic.findById(req.params.postId);
        !topic && res.status(404).json("Topic not found.");

        let entries = Entry.find({postId:req.params.postId});
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Entry.countDocuments(Entry.find({postId:req.params.postId}));

        const pages = Math.ceil(total / pageSize);

        entries = entries.skip(skip).limit(pageSize);

        const result = await entries;

        res.status(200).json({
            count: result.length,
            page,
            pages,
            data: result
        }); 
    }catch(err){
        console.log(err);
    }
};
//get profile entries
export const getProfileEntries = async (req,res,next) => {
    try{
        const entries = await Entry.find({nickname:req.params.nickname});

        res.status(200).json(entries.sort((a,b) => b.createdAt - a.createdAt)); 
    }catch(err){
        console.log(err);
    }
};
//get an entry
export const getEntry = async (req,res,next) => {
    try{
        const entry = await Entry.findOne({sequence:req.params.sequence});

        res.status(200).json(entry); 
    }catch(err){
        console.log(err);
    }
};
//get random entry
export const getRandom = async (req,res,next) => {
    try{
        const entry = await Entry.aggregate([{ $sample: { size: 5 } }]);
        !entry && res.status(404).json("Not found")

        res.status(200).json(entry.sort((a,b) => b.createdAt - a.createdAt)); 
    }catch(err){
        console.log(err);
    }
};

//get most liked entries
export const mostLiked = async (req,res,next) => {
    try{
        const entries = await Entry.find({createdAt:{$gt:new Date(Date.now() - 24*60*60 * 1000)}}).limit(5);

        const sortedEntries = entries.sort((a,b) => b.like.length - a.like.length);

        res.status(200).json(sortedEntries)
    }catch(err){
        console.log(err)
    }
};

//get most followings entries
export const followingEntries = async (req,res,next) => {
    try{
        const user =await Auth.findById(req.user.id);

        const entries =await Promise.all((user.followings.map((followId) => {
            return Entry.find({userId:followId})
        })));

        res.status(200).json(entries.flat())
    }catch(err){
        console.log(err)
    }
};

//get liked entries
export const likedEntries = async (req,res,next) => {
    try{
        const user = await Auth.findById(req.user.id);

        const entries =await Promise.all((user.liked.map((entryId) => {
            return Entry.findById(entryId)
        })));

        res.status(200).json(entries.flat())
    }catch(err){
        console.log(err)
    }
};