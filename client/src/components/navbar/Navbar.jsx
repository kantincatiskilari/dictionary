import './navbar.css';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {Link, useNavigate} from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changePage } from '../../redux/pageSlice';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../redux/userSlice';
import { fetchTopicFailure, fetchTopicStart, fetchTopicSuccess } from '../../redux/topicSlice';

export default function Navbar() {

const dispatch = useDispatch();
const [active,setActive] = useState("today");
const {user} = useSelector(state => state.user);
const {topic} = useSelector(state => state.topic);
const [search,setSearch] = useState("");
const navigate = useNavigate();


useEffect(() => {
    dispatch(changePage({page:active}))
},[active]);

useEffect(() => {
    const fetchData = async () => {
        dispatch(fetchTopicStart())
        try{
            const res = await axios.get("/topics/all-topics");
            dispatch(fetchTopicSuccess(res.data));
        }catch(err){
            dispatch(fetchTopicFailure())
            console.log(err)
        }
    }
    fetchData()
},[]);



const handleSearch = async (e) => {
    setSearch("")
    e.preventDefault()
    try{
        const res = await axios.get("/topics/find/"+search);
        navigate("/topics/"+res.data._id);
    }catch(err){
        navigate("/new/"+search);
    }
};

const handleLogout = async () => {
    try{
        await axios.get("/auth/logout")
        dispatch(logout());
    }catch(err){
        console.log(err)
    }
};

const searchTopics = topic.filter((item) => {
    return search.length > 0 && item.desc.startsWith(search.toLowerCase())
});

  return (
    <div className="navbar">
        <div className="navbarContainers">
            <div className="navbarTopContainer">       
                <div className="left">
                    <Link to="/" className='link' onClick={() => setSearch("")}>
                        <div className="logo" ><PetsIcon /> paw dictionary</div>
                    </Link>
                </div>
                <div className="center">
                    <form 
                    className='searchForm' 
                    onKeyDown={
                        (e) => {
                            if(e.key == "Enter") {
                                handleSearch(e)
                            }
                        }
                    }>
                        <input type="text" className="searchInput" placeholder='search for a topic' value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())}/>
                        <span className="searchButton" onClick={handleSearch}>
                            <SearchIcon />
                        </span>
                        <div className="searchResults" style={{display: searchTopics.length > 0 ? "block" : "none"}}>
                            {searchTopics.map((topic) => (
                                <Link className='link' to={"/topics/"+topic._id} key={topic._id}>
                                    <div className="result" onClick={() => setSearch("")}>{topic.desc}</div>
                                </Link>
                            ))}
                        </div>
                    </form>
                </div>
                <div className="right">
                    {user
                    ? 
                    <ul className="accountList">
                    <Link to={"/profile/"+user.nickname} className='link'>
                        <li className="accountListItem"><PersonOutlineOutlinedIcon />me</li>
                    </Link>
                        <li className="accountListItem" onClick={handleLogout}><LogoutIcon /> logout</li>
                    </ul>
                    :
                    <>
                        <Link className='link' to="/login">
                            <span style={{marginRight: "20px"}}>login</span>
                        </Link>
                        <Link className='link' to="/register">
                            <span>register</span>
                        </Link>
                    </>
                    }
                    
                </div>
            </div>
            <div className="navbarBottomContainer">
                {user 
                ?
                <ul className="navbarBottom">
                    <li className={active === "today" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("today")}>today</li>
                    <li className={active === "all-topics" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("all-topics")}>all topics</li> 
                    <li className={active === "following topics" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("following topics")}>following topics</li>
                    <li className={active === "selection from today" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("selection from today")}>selection from today</li>
                    <li className={active === "follows" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("follows")}>follows</li>
                    <li className={active === "the ones you liked" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("the ones you liked")}>the ones you liked</li>
                </ul>
                :
                <ul className="navbarBottom">
                <li className={active === "today" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("today")}>today</li>
                <li className={active === "all-topics" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("all-topics")}>all topics</li> 
                <li className={active === "selection from today" ? "navbarBottomItem active" : "navbarBottomItem"} onClick={() => setActive("selection from today")}>selection from today</li>
            </ul>
            }
            </div>
        </div>
    </div>
  )
}
