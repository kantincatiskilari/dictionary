import express from 'express';
import { deleteEntry, likeEntry, unlikeEntry, postEntry, getEntries, getProfileEntries, getEntry, getRandom, mostLiked, followingEntries, likedEntries } from '../controllers/entries.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

//post an entry
router.post("/:postId",verifyToken,postEntry);
//delete an entry
router.delete("/:entryId",verifyToken,deleteEntry);
//like an entry
router.put("/like/:entryId",verifyToken,likeEntry);
//unlike an entry
router.put("/unlike/:entryId",verifyToken,unlikeEntry);
//get entries
router.get("/:postId",getEntries);
//get profile entries
router.get("/profile/:nickname",getProfileEntries);
//get an entry
router.get("/find/:sequence",getEntry);
//get random entry
router.get("/",getRandom);
//get most liked entries
router.get("/selection/today",mostLiked);
//get follower entries
router.get("/following/entries",verifyToken,followingEntries);
//get liked entries
router.get("/liked/entries",verifyToken,likedEntries);

export default router;