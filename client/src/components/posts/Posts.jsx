import Post from "../post/Post";
import "./posts.css";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  postStart,
  postSuccess,
  postFailure,
} from "../../redux/postSlice";
import { followTopic, unfollowTopic } from "../../redux/userSlice";
import { Helmet } from "react-helmet";
import SearchIcon from "@mui/icons-material/Search";
import Loading from 'react-loading-animation';

export default function Posts() {
  const { user } = useSelector((state) => state.user);
  const { post } = useSelector((state) => state.post);
  const pending = useSelector((state) => state.post.isPending);


  const params = useParams();
  const entryRef = useRef("");
  const [followTopics, setFollowTopics] = useState(
    user?.followingTopics?.includes(params.topicId)
  );
  const [topic, setTopic] = useState("");
  const dispatch = useDispatch();
  const [subject, setSubject] = useState("");
  const [tab, setTab] = useState(false);
  const inputRef = useRef("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const selectPage = [];

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await axios.get("/topics/" + params.topicId);
        setTopic(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopic();
  }, [params.topicId]);

  useEffect(() => {
    const fetchEntries = async () => {
      dispatch(fetchStart());
      try {
        const res = await axios.get(`/entries/${params.topicId}?page=${page}`);
        const { data, pages: totalPages } = res.data;
        if (subject === "liked") {
          data.sort((a, b) => b.like.length - a.like.length);
          dispatch(fetchSuccess(data));
        } else if (subject === "today") {
          const DAY = 24 * 60 * 60 * 1000;
          const aDayAgo = new Date(Date.now() - DAY);
          const final = data.filter(
            (item) => new Date(item.createdAt) > aDayAgo
          );
          dispatch(fetchSuccess(final));
          setTab(false);
        } else if (subject === "my entries") {
          const final = data.filter((item) => item.nickname === user.nickname);
          dispatch(fetchSuccess(final));
          setTab(false);
        } else if (subject === inputRef.current?.value) {
          let arr = [];
          const final = data.map((item) => {
            if (item.desc.includes(inputRef.current.value)) {
              item["highlight"] = inputRef.current.value;
              return item;
            }
          });
          final.map((item) => {
            if (item !== undefined) {
              arr.push(item);
            }
          });
          dispatch(fetchSuccess(arr));
          inputRef.current.value = "";
          setTab(false);
        } else {
          dispatch(fetchSuccess(data));
        }
        setPages(totalPages);
      } catch (err) {
        console.log(err);
        dispatch(fetchFailure());
      }
    };
    fetchEntries();
  }, [params.topicId, page, subject]);

  for (let i = 1; i < pages + 1; i++) {
    selectPage.push(i);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(postStart());
    try {
      const res = await axios.post("/entries/" + params.topicId, {
        desc: entryRef.current.value,
        nickname: user.nickname,
      });
      dispatch(postSuccess(res.data));
      entryRef.current.value = "";
    } catch (err) {
      console.log(err);
      dispatch(postFailure());
    }
  };

  const handleFollow = async () => {
    if (!user.followingTopics.includes(params.topicId)) {
      await axios.put("/users/follow/topic/" + params.topicId);
      dispatch(followTopic(params.topicId));
      setFollowTopics(true);
    }
    if (followTopics) {
      await axios.put("/users/unfollow/topic/" + params.topicId);
      dispatch(unfollowTopic(params.topicId));
      setFollowTopics(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{topic ? `${topic?.desc}` : "paw dictionary"}</title>
      </Helmet>
      {pending 
      ? <div className="loading"><Loading /></div> 
      : <>
      <div className="topic" onClick={() => setSubject("")}>
        {topic?.desc}
      </div>
      <div className="topicInfo">
        <div className="topicDetails">
          <span
            className="topicDetail"
            onClick={() => setSubject("liked")}
            style={{ color: subject === "liked" && "rgb(0, 195, 255)" }}
          >
            sort liked
          </span>
          <span className="topicDetail" onClick={() => setTab(!tab)}>
            search in topic <ArrowDropDownOutlinedIcon />
          </span>
          <div className="searchTab" style={{ display: tab && "flex" }}>
            <div className="searchTabItem" onClick={() => setSubject("today")}>
              today
            </div>
            <div
              className="searchTabItem"
              onClick={() => setSubject("my entries")}
            >
              my entries
            </div>
            <div className="searchTabItem">
              <input
                type="text"
                className="searchTabInput"
                placeholder="search for word"
                ref={inputRef}
              />
              <div
                className="searchTabButton"
                onClick={() => setSubject(inputRef.current.value)}
              >
                <SearchIcon className="searchTabIcon" />
              </div>
            </div>
          </div>
          <span className="topicDetail" onClick={handleFollow}>
            {followTopics ? "unfollow" : "follow"}
          </span>
        </div>

        {pages > 1 && (
          <div className="topicPage">
            <button>
              <ChevronLeftOutlinedIcon
                onClick={() => setPage(page > 1 ? (page) => page - 1 : 1)}
              />
            </button>
            <select onChange={(e) => setPage(e.target.value)} value={page}>
              {selectPage.map((item) => (
                <option key={page}>{item}</option>
              ))}
            </select>
            <span>/</span>
            <button onClick={() => setPage(pages)}>{pages}</button>
            <button>
              <ChevronRightOutlinedIcon
                onClick={() =>
                  setPage(page < pages ? (page) => page + 1 : pages)
                }
              />
            </button>
          </div>
        )}
      </div>
      <div className="posts">
        {pending === false && post?.length > 0 ? (
          post?.map((item) => <Post entry={item} key={item?._id} />)
        ) : (
          <div className="entryNotFound">there is no entry in this topic</div>
        )}
      </div>
      {user && (
        <div className="newEntryContainer">
          <textarea
            className="newEntry"
            placeholder={`write your thoughts about ${post[0]?.postName}...`}
            ref={entryRef}
          />
          <button className="submitEntry" onClick={handleSubmit}>
            send
          </button>
        </div>
      )}
      <div className="topicInfo">
        {pages > 1 && (
          <div className="topicPage">
            <button>
              <ChevronLeftOutlinedIcon
                onClick={() => setPage(page > 1 ? (page) => page - 1 : 1)}
              />
            </button>
            <select onChange={(e) => setPage(e.target.value)} value={page}>
              {selectPage.map((item) => (
                <option key={page}>{item}</option>
              ))}
            </select>
            <span>/</span>
            <button onClick={() => setPage(pages)}>{pages}</button>
            <button>
              <ChevronRightOutlinedIcon
                onClick={() =>
                  setPage(page < pages ? (page) => page + 1 : pages)
                }
              />
            </button>
          </div>
        )}
      </div>
      </>}
      
    </>
  );
}
