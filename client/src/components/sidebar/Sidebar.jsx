import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./sidebar.css";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchTopicSuccess } from "../../redux/topicSlice";
import { CSSProperties } from "react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { page } = useSelector((state) => state.page.page);
  const pageFormatted = page?.replace("-", " ");
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);

  const override = (CSSProperties = {
    display: "block",
    margin: "10px 75px",
    borderColor: `rgb(0, 195, 255)`,
  });

  useEffect(() => {
    const fetchTopics = async () => {
      setTopics([]);
      try {
        if (page === "selection from today") {
          const res = await axios.get("/entries/selection/today");
          setTopics(res.data);
        }
        if (page === "follows") {
          const res = await axios.get("/entries/following/entries");
          setTopics(res.data);
        }
        if (page === "the ones you liked") {
          const res = await axios.get("/entries/liked/entries");
          setTopics(res.data.filter((data) => data !== null));
        }
        if (page === "following topics") {
          const res = await axios.get("/topics/following/find");
          setTopics(res.data);
        }
        if (page === "today") {
          const res = await axios.get("/topics/" + page);
          setTopics(res.data);
        }
        if (page === "all-topics") {
          const res = await axios.get("/topics/" + page);
          setTopics(res.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchTopics();
  }, [page]);

  useEffect(() => {
    setLoading(true);
  }, [page]);

  return (
    <div className="sidebar">
      <div className="sidebarTitle">{pageFormatted}</div>
      {loading ? (
        <ClipLoader
          loading={loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
          cssOverride={override}
        />
      ) : (
        <div className="sidebarSubtitles">
          {topics.length === 0 ? (
            <div style={{ fontWeight: "300", alignSelf: "center" }}>
              there's no topic here...
            </div>
          ) : (
            topics.map((topic) =>
              topic?.nickname ? (
                <Link
                  className="link"
                  to={"/entry/" + topic?.sequence}
                  key={topic._id}
                >
                  <div className="sidebarSubtitle">
                    {topic?.postName}
                    <div className="sidebarSubtitleNickname">
                      {topic?.nickname}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  className="link"
                  to={"/topics/" + topic?._id}
                  key={topic?._id}
                >
                  <div className="sidebarSubtitle">{topic?.desc}</div>
                </Link>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
