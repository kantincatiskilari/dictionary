import "./singleEntry.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Post from "../../components/post/Post";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuccess } from "../../redux/postSlice";
import { Link } from "react-router-dom";

export default function SingleEntry() {
  const dispatch = useDispatch();
  const params = useParams().sequence;
  const { post } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.user);
  const [entry, setEntry] = useState([]);
  const [topic, setTopic] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get("/entries/find/" + params);
      dispatch(fetchSuccess(res.data));
    };
    fetchPost();
  }, [params]);

  console.log(entry)

  useEffect(() => {
    const fetchTopic = async () => {
      const res = await axios.get("/topics/" + entry.postId);
      setTopic(res.data);
    };
    fetchTopic();
    setLoading(false);
  }, [entry]);

  return (
    <div className="singleEntry">
      <Helmet>
        <title>{`${post.postName}`}</title>
      </Helmet>
      <Sidebar />
      {loading ? (
        <Skeleton
          variant="rectangular"
          width={710}
          height={30}
          sx={{ bgcolor: "grey.800" }}
        />
      ) : (
        <div className="singleEntryWrapper">
          <div className="singleeEntryContainer">
            <div className="topic">{post?.postName}</div>
            <Post entry={post}/>
          </div>
          <Link className="link" to={"/topics/" + post?.postId}>
            <button className="entryButton">
              click to see all entries to this topic
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
