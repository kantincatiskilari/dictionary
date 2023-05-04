import express from 'express';
import { deleteUser, followUser, unfollowUser, getUser, updateUser, getUserId, followTopic, unfollowTopic } from '../controllers/users.js';
import {verifyToken} from '../verifyToken.js';

const router = express.Router();

//get a user
router.get("/:nickname",getUser);
//get a user by id
router.get("/find/:userId",getUserId);
//update a user
router.put("/update",verifyToken,updateUser);
//delete a user
router.delete("/delete",verifyToken,deleteUser);
//follow a user
router.put("/follow/:userId",verifyToken,followUser);
//unfollow a user
router.put("/unfollow/:userId",verifyToken,unfollowUser);
//follow a topic
router.put("/follow/topic/:topicId",verifyToken,followTopic);
//unfollow a topic
router.put("/unfollow/topic/:topicId",verifyToken,unfollowTopic);

export default router;