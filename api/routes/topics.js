import express from 'express';
import { createTopic, deleteTopic, getTodaysTopics, getTopic, getAllTopics, getTopicByDesc, getFollowingTopics } from '../controllers/topics.js';
import {verifyToken} from '../verifyToken.js';

const router = express.Router();

//create a topic
router.post("/create",verifyToken,createTopic);
//delete a topic
router.delete("/delete/:postId",verifyToken,deleteTopic);
//get todays topics
router.get("/today",getTodaysTopics);
//get all topics
router.get("/all-topics",getAllTopics);
//get a topic
router.get("/:topicId",getTopic);
//get a topic
router.get("/find/:desc",getTopicByDesc);
//get following topics
router.get("/following/find",verifyToken,getFollowingTopics);

export default router;