import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/sidebar/Sidebar";
import "./follow.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { followUser, unfollowUser } from "../../redux/userSlice";

export default function Follow({ type }) {
  const [profileUser, setProfileUser] = useState("");
  const [follow, setFollow] = useState([]);
  const location = useLocation().pathname.split("/")[1];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/" + location);
        setProfileUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [location]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (type) {
        const res = await Promise.all(
          profileUser?.followings?.map(async (friendId) => {
            return axios.get("/users/find/" + friendId);
          })
        );
        setFollow(res);
      } else {
        const res = await Promise.all(
          profileUser?.followers?.map(async (friendId) => {
            return axios.get("/users/find/" + friendId);
          })
        );
        setFollow(res);
      }
    };
    fetchUsers();
    setLoading(false);
  }, [profileUser, user]);

  const handleFollow = async (id) => {
    await axios.put("/users/follow/" + id);
    dispatch(followUser(id));
  };
  const handleUnfollow = async (id) => {
    await axios.put("/users/unfollow/" + id);
    dispatch(unfollowUser(id));
  };

  return (
    <div className="follow">
      <Sidebar />
        <div className="followContainer">
          <div className="followPageUser">
            <div className="followPageUsername">
              {location.replace("%20", " ")}
            </div>
            <div className="followPageStatus">
              {type
                ? `followings(${follow?.length})`
                : `followers(${follow?.length})`}
            </div>
          </div>
          {follow.length === 0 ? (
            <div>There is no user in the list.</div>
          ) : (
            follow.map((follower) => (
              <div className="followPageProfile">
                <div className="followPageProfileAvatar">
                  <img src={follower.data.avatar} alt="" />
                </div>

                <Link
                  className="link"
                  to={"/profile/" + follower.data.nickname}
                >
                  <div className="followPageProfileName">
                    {follower.data.nickname}
                  </div>
                </Link>

                {type ? (
                  user?.followings.includes(follower.data._id) ? (
                    <button
                      className="followPageButton unfollow"
                      onClick={() => handleUnfollow(follower.data._id)}
                    >
                      unfollow
                    </button>
                  ) : (
                    user?._id !== follower.data._id && (
                      <button
                        className="followPageButton"
                        onClick={() => handleFollow(follower.data._id)}
                      >
                        follow
                      </button>
                    )
                  )
                ) : user?.followers.includes(follower.data._id) ? (
                  <button
                    className="followPageButton unfollow"
                    onClick={() => handleUnfollow(follower.data._id)}
                  >
                    unfollow
                  </button>
                ) : (
                  user?._id !== follower.data._id && (
                    <button
                      className="followPageButton"
                      onClick={() => handleFollow(follower.data._id)}
                    >
                      follow
                    </button>
                  )
                )}
              </div>
            ))
          )}
        </div>
    </div>
  );
}
