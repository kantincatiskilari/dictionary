import "./profile.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Post from "../../components/post/Post";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  followUser,
  unfollowUser,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../../redux/userSlice";
import { Helmet } from "react-helmet";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineTwoToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fetchStart, fetchSuccess } from "../../redux/postSlice";

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const { post } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [active, setActive] = useState("entries");
  const [profileUser, setProfileUser] = useState("");
  const [allEntries, setAllEntries] = useState();
  const location = useLocation().pathname.split("/")[2];
  const [followers, setFollowers] = useState();
  const [popUp, setPopUp] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);

  const override = (CSSProperties = {
    display: "block",
    margin: "300px",
    borderColor: `rgb(0, 195, 255)`,
  });

  const PF = "http://localhost:4400/api/images/";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/" + location);
        setProfileUser(res.data);
        setFollowers(res.data.followers.length);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [location]);

  useEffect(() => {
    const fetchEntries = async () => {
      dispatch(fetchStart());
      try {
        if (active === "entries") {
          const res = await axios.get("/entries/profile/" + location);
          setAllEntries(res.data.length);
          dispatch(fetchSuccess(res.data));
        }
        if (active === "favorites") {
          const res = await axios.get("/entries/liked/entries");
          dispatch(fetchSuccess(res.data.filter((item) => item)));
        }
        if (active === "most liked") {
          const res = await axios.get("/entries/profile/" + location);
          dispatch(
            fetchSuccess(res.data.sort((a, b) => b.like.length - a.like.length))
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntries();
  }, [active]);

  const handleFollow = async () => {
    if (!user.followings.includes(profileUser._id)) {
      await axios.put("/users/follow/" + profileUser._id);
      dispatch(followUser(profileUser?._id));
      setFollowers(followers + 1);
    }
  };

  const handleUnfollow = async () => {
    if (user.followings.includes(profileUser._id)) {
      await axios.put("/users/unfollow/" + profileUser._id);
      dispatch(unfollowUser(profileUser._id));
      setFollowers(followers - 1);
    }
  };

  const handleAvatar = async (img) => {
    try {
      const data = new FormData();
      data.append("image", img);
      const res = await axios.post("/upload", data);
      setAvatar(res.data.filename);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    dispatch(updateStart());
    try {
      const res = await axios.put("/users/update", { avatar: PF + avatar });
      dispatch(updateSuccess(res.data));
      setPopUp(false);
    } catch (err) {
      console.log(err);
      dispatch(updateFailure());
    }
  };

  return (
    <div className="profile">
      <Helmet>
        <title>{`user: ${profileUser.nickname}`}</title>
      </Helmet>
      <div
        className="userAvatarPopUp"
        style={{ display: popUp ? "flex" : "none" }}
      >
        <LazyLoadImage
          src={avatar ? PF + avatar : profileUser?.avatar}
          effect="blur"
          className="userAvatar"
        />
        <div className="popupButtons">
          {avatar && <DoneIcon className="doneIcon" onClick={handleUpdate} />}
          <label
            className="popupButton"
            style={{ backgroundColor: " rgb(0, 195, 255)" }}
          >
            upload
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleAvatar(e.target.files[0])}
            />
          </label>
          <button className="popupButton" onClick={() => setPopUp(false)}>
            cancel
          </button>
        </div>
      </div>
      <Sidebar />
      {loading ? (
        <ClipLoader
          loading={loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
          cssOverride={override}
        />
      ) : profileUser ? (
        <div className="profileWrapper" style={{ opacity: popUp ? ".5" : "1" }}>
          <div className="profileContainer">
            <div className="profileUserInfo">
              <div className="profileUsername">{profileUser?.nickname}</div>
              <div className="profileUserStatistics">
                <span className="profileUserStatistic">
                  {allEntries} entry{" "}
                </span>
                •
                <Link className="link" to={`/${location}/followers`}>
                  <span className="profileUserStatistic">
                    {followers} followers
                  </span>
                </Link>
                •
                <Link className="link" to={`/${location}/followings`}>
                  <span className="profileUserStatistic">
                    {profileUser.followings?.length} followings
                  </span>
                </Link>
              </div>
              {user?._id !== profileUser._id && user ? (
                <button
                  className={
                    user?.followings.includes(profileUser._id)
                      ? "followedUser"
                      : "unfollowedUser"
                  }
                  onClick={
                    user?.followings.includes(profileUser._id)
                      ? handleUnfollow
                      : handleFollow
                  }
                >
                  {user?.followings.includes(profileUser._id)
                    ? "unfollow"
                    : "follow"}
                </button>
              ) : (
                ""
              )}
            </div>
            <div
              className="profileUserAvatar"
              style={{ cursor: profileUser?._id === user?._id && "pointer" }}
              onClick={() => setPopUp(profileUser?._id === user?._id && true)}
            >
              <img
                className="userAvatar"
                src={
                  profileUser?._id === user?._id
                    ? user?.avatar
                    : profileUser?.avatar
                }
                alt=""
              />
            </div>
          </div>
          <div className="profileSectionWrapper">
            <span
              className={
                active === "entries"
                  ? "profileSection active"
                  : "profileSection"
              }
              onClick={() => setActive("entries")}
            >
              entries
            </span>
            <span
              className={
                active === "favorites"
                  ? "profileSection active"
                  : "profileSection"
              }
              onClick={() => setActive("favorites")}
            >
              favorites
            </span>
            <span
              className={
                active === "most liked"
                  ? "profileSection active"
                  : "profileSection"
              }
              onClick={() => setActive("most liked")}
            >
              most liked entries
            </span>
          </div>
          {post?.map((entry) => (
            <div className="profileEntryWrapper" key={entry?._id}>
              <Link className="link" to={"/topics/" + entry?.postId}>
                <div className="topic">{entry?.postName}</div>
              </Link>
              <Post type entry={entry} key={entry?._id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="profileNotFound">
          <div className="notFoundIcon">
            <ErrorOutlineTwoToneIcon />
          </div>
          user {location} not found.
        </div>
      )}
    </div>
  );
}
