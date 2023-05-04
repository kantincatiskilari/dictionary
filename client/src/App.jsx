import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Follow from './pages/follow/Follow';
import NewTopic from './pages/newTopic/NewTopic';
import { useSelector } from 'react-redux';
import SingleEntry from './pages/singleEntry/SingleEntry';
import Topic from './pages/topic/Topic';
import { useEffect, lazy, Suspense } from 'react';
import Cookies from 'universal-cookie';

function App() {
  const {user} = useSelector(state => state.user);
  const {page} = useSelector(state => state.page.page);
  const cookies = new Cookies();

  useEffect(() => {  
    if(!cookies.get("access_token")){
      cookies.set("access_token",user?.access_token)
    }
  },[])

  return (
    <div className="app">
      <Router>
      <Navbar />
        <Routes>
          <Route path='/profile/:username' element={<Profile />}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/:username/followings' element={<Follow type/>}/>
          <Route path='/:username/followers' element={<Follow />}/>
          <Route path='/new/:topicname' element={<NewTopic />}/>
          <Route path='/entry/:sequence' element={<SingleEntry />}/>
          <Route path='/topics/:topicId' element={<Topic />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
