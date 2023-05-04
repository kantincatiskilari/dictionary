import "./post.css";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import { format } from "timeago.js";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeEntry } from "../../redux/userSlice";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import { postDelete } from "../../redux/postSlice";

export default function Post({ entry }) {
  const dispatch = useDispatch();
  const [postUser, setPostUser] = useState("");
  const { user } = useSelector((state) => state.user);
  const { post } = useSelector((state) => state.post);
  const [likedUser, setLikedUser] = useState([]);
  const [openTab, setOpenTab] = useState(false);
  const tabRef = useRef("");
  const [like, setLike] = useState(entry?.like?.length);
  const [deleteTab, setDeleteTab] = useState(false);
  const [entryLiked, setEntryLiked] = useState(false);

  useEffect(() => {
    setEntryLiked(entry?.like?.includes(user?._id) ? true : false);
  }, [entry]);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (!tabRef.current.contains(e.target)) {
        setOpenTab(false);
      }
    });
  }, []);

  useEffect(() => {
    const postUser = async () => {
      try {
        const res = await axios.get("/users/" + entry?.nickname);
        setPostUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    postUser();
  }, [entry]);

  const handleLike = async () => {
    try {
      if (!entryLiked) {
        await axios.put("/entries/like/" + entry?._id);
        setLike(like + 1);
        setEntryLiked(true);
        dispatch(likeEntry(entry._id));
      } else {
        await axios.put("/entries/unlike/" + entry?._id);
        setLike(like - 1);
        setEntryLiked(false);
        dispatch(likeEntry(entry._id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikeUsers = async () => {
    try {
      const res = await Promise.all(
        entry.like.map((item) => {
          if (item !== user._id) {
            return axios.get("/users/find/" + item);
          }
        })
      );
      setLikedUser(res.filter((item) => item !== undefined));
      setOpenTab(!openTab);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/entries/" + entry?._id);
      dispatch(postDelete(entry._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        {entry?.highlight ? (
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[entry?.highlight]}
            autoEscape={true}
            textToHighlight={entry?.desc}
          />
        ) : (
          <div className="postHeader">
            <div className="postDesc">{entry?.desc}</div>
            {user?._id === postUser?._id && (
              <div
                className="postDeleteIcon"
                onClick={() => setDeleteTab(!deleteTab)}
              >
                <DeleteOutlineTwoToneIcon />
              </div>
            )}
            <div
              className="deleteTab"
              style={{ display: deleteTab ? "block" : "none" }}
            >
              <div className="deleteMsg">
                Are you sure to delete this entry?
              </div>
              <div className="deleteButtons">
                <button className="deleteButton confirm" onClick={handleDelete}>
                  yes
                </button>
                <button
                  className="deleteButton"
                  onClick={() => setDeleteTab(false)}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="postInfo">
          <div className="postLike">
            <PetsOutlinedIcon
              onClick={handleLike}
              className={entryLiked ? "liked" : ""}
            />
            {post.length > 0 ? (
              <span onClick={handleLikeUsers}>{like > 0 && like}</span>
            ) : (
              <span onClick={handleLikeUsers}>
                {entry?.like?.length > 0 && entry.like.length}
              </span>
            )}
            <div
              className="likedUsersWrapper"
              style={{ display: openTab ? "block" : "none" }}
              ref={tabRef}
            >
              {likedUser?.map((user, index) => (
                <Link
                  className="link"
                  to={"/profile/" + user?.data.nickname}
                  key={index}
                >
                  {user && (
                    <div className="likedUsers" key={index}>
                      @{user?.data.nickname}
                    </div>
                  )}
                </Link>
              ))}
              {entryLiked && (
                <Link className="link" to={"/profile/" + user?.nickname}>
                  <div className="likedUsers">@{user?.nickname}</div>
                </Link>
              )}
            </div>
          </div>
          <div className="postUser">
            <div className="postUserWrapper">
              <Link className="link" to={"/profile/" + postUser?.nickname}>
                <div className="postUsername" key={postUser._id}>
                  {postUser?.nickname}
                </div>
              </Link>
              <Link
                className="link"
                to={"/entry/" + entry?.sequence}
                key={entry?.sequence}
              >
                <div className="postDate">{format(entry?.createdAt)}</div>
              </Link>
            </div>
            <LazyLoadImage
              src={postUser?.avatar}
              effect="blur"
              className="postUserAvatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
