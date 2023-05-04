import { useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.css";
import { fetchStart, fetchSuccess, fetchFailure } from "../../redux/postSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Post from "../../components/post/Post";
import { Helmet } from "react-helmet";
import { useState } from "react";
import Loading from "react-loading-animation";

export default function Home({ type }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.post);

  useEffect(() => {
    const fetchRandom = async () => {
      dispatch(fetchStart());
      try {
        const res = await axios.get("/entries");
        dispatch(fetchSuccess(res.data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        dispatch(fetchFailure());
      }
    };
    fetchRandom();
  }, [type]);

  return (
    <div className="home">
      <Helmet>
        <title>home - paw dictionary</title>
      </Helmet>
      <Sidebar />
      {loading && (
        <div className="loading">
          <Loading />
        </div>
      )}
      <div className="topicWrapper">
        {post?.length > 0 &&
          post?.map((entry, index) => (
            <div className="randomEntryWrapper" key={entry.sequence}>
              <Link className="link" to={"/topics/" + entry.postId}>
                <div className="topic">{entry.postName}</div>
              </Link>
              <Post entry={entry} key={index} />
            </div>
          ))}
      </div>
    </div>
  );
}
